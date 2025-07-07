import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { FieldType } from '../blueprints/enums/field.enum';

import { BlueprintsService } from '../blueprints/blueprints.service';

import { Workspace } from '../entities/workspace.entity';
import { DynamicEntity } from './entities/dynamic-entity.entity';

import { MessageResponse } from '@/interfaces/general.interface';
import { DynamicEntityListDto } from './dto/dynamic-entity-list.dto';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { WSBlueprint } from '../blueprints/schemas/blueprint.schema';
import { WSBlueprintFieldSchemaDefinition } from '../blueprints/schemas/field.schema';
import { WSBlueprintRelationshipSchemaDefinition } from '../blueprints/schemas/relationship.schema';
import { BlueprintRelationshipDto } from '../blueprints/dto/relationship.dto';
import { ForeignKeyType } from '../blueprints/enums/relation.enum';
import { DepartmentsService } from '../departments/departments.service';
import { ProjectsService } from '../departments/projects/projects.service';
import { AppsService } from '../apps/apps.service';
import { Department } from '../departments/entities/department.entity';
import { Project } from '../departments/projects/entities/project.entity';
import { App } from '../apps/entities/app.entity';



@Injectable()
export class DynamicEntitiesService {

  TABLE_PREFIX = 'ws_dynamic_entity_';

  constructor(
    @InjectRepository(DynamicEntity)
    private readonly dynamicEntityRepository: Repository<DynamicEntity>,
    private readonly blueprintService: BlueprintsService,
    private readonly departmentService: DepartmentsService,
    private readonly projectService: ProjectsService,
    private readonly appService: AppsService,
    private dataSource: DataSource
  ) { }

  async create(workspace: Pick<Workspace, 'id'>, createDynamicEntityDto: CreateDynamicEntityDto): Promise<MessageResponse & { dynamicEntity: DynamicEntity }> {
    if (!createDynamicEntityDto.blueprintId && !createDynamicEntityDto.newBlueprint) {
      throw new BadRequestException('Either blueprintId or newBlueprint must be provided');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const { name, description, blueprintId, newBlueprint } = createDynamicEntityDto;

      const existing = await this.dynamicEntityRepository.findOne({ where: { name } });
      if (existing) throw new BadRequestException('A table with this name already exists.');

      await queryRunner.connect();
      await queryRunner.startTransaction();

      let blueprint: WSBlueprint | null = null;
      if (blueprintId) {
        blueprint = await this.blueprintService.findOne(workspace, blueprintId);
      } else if (newBlueprint) {
        const savedBlueprint = await this.blueprintService.create(workspace, newBlueprint);
        blueprint = savedBlueprint.blueprint;
      }

      if (!blueprint) throw new NotFoundException('Blueprint not found');

      const entryTableName = `${this.TABLE_PREFIX}${name}`;
      const fields = blueprint.fields || [];
      const relationships = blueprint.relationships || [];

      const columnDefs = fields.map(field => {
        const sqlType = this.getPostgresTypeFromField(field);
        const isRequired = field.required ? 'NOT NULL' : 'NULL';
        return `"${field.key}" ${sqlType} ${isRequired}`;
      });

      for (const relation of relationships) {
        const column = `"${relation.sourceField}" INTEGER`;
        columnDefs.push(column);
      }

      for (const relation of relationships) {
        const fkType = this.getPostgresFkType(relation.foreignKeyType);
        const isRequired = relation.required ? 'NOT NULL' : 'NULL';
        columnDefs.push(`"${relation.sourceField}" ${fkType} ${isRequired}`);
      }

      columnDefs.push(`
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    `);


      const createTableSQL = `
            CREATE TABLE IF NOT EXISTS "${entryTableName}" (
              ${columnDefs.join(',\n    ')}${relationships.length > 0 ? ',\n    ' + this.generateForeignKeyConstraints(relationships, entryTableName) : ''
        }
            )
          `;

      await queryRunner.query(createTableSQL);

      const dynamicEntity = await queryRunner.manager.save(DynamicEntity, {
        name,
        description,
        workspace,
        blueprintId: blueprint.id,
      });

      await queryRunner.commitTransaction();
      return { message: 'Dynamic entity created successfully.', dynamicEntity: dynamicEntity  };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create dynamic entity', err);
    } finally {
      await queryRunner.release();
    }
  }

  async update(workspace: Pick<Workspace, 'id'>, id: number, updateDynamicEntityDto: UpdateDynamicEntityDto): Promise<MessageResponse> {

    const existingEntity = await this.findOne(workspace, id);


    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (updateDynamicEntityDto.description) {
        existingEntity.description = updateDynamicEntityDto.description;
      }


      let blueprint: WSBlueprint | null = null;

      if (updateDynamicEntityDto.blueprintId && updateDynamicEntityDto.blueprintId !== existingEntity.blueprintId) {
        blueprint = await this.blueprintService.findOne(workspace, updateDynamicEntityDto.blueprintId);
      } else if (existingEntity.blueprintId)
        blueprint = await this.blueprintService.findOne(workspace, existingEntity.blueprintId);

      if (blueprint) {
        const entryTableName = `${this.TABLE_PREFIX}${existingEntity.name}`;
        const oldFields = existingEntity.values.map(f => f.key);
        const newFields: WSBlueprintFieldSchemaDefinition[] = blueprint.fields || [];

        for (const field of newFields) {
          if (!oldFields.includes(field.key)) {
            const sqlType = this.getPostgresTypeFromField(field);
            const isRequired = field.required ? 'NOT NULL' : 'NULL';
            const alterSQL = `ALTER TABLE "${entryTableName}" ADD COLUMN IF NOT EXISTS "${field.key}" ${sqlType} ${isRequired}`;
            await queryRunner.query(alterSQL);
          }
        }

        for (const key of oldFields) {
          if (!newFields.includes(key)) {
            const dropSQL = `ALTER TABLE "${entryTableName}" DROP COLUMN IF EXISTS "${key}"`;
            await queryRunner.query(dropSQL);
          }
        }

        const oldRelations = existingEntity.relationships?.map(f => f.sourceField) || [];
        const newRelations: WSBlueprintRelationshipSchemaDefinition[] = blueprint.relationships || [];


        for (const oldField of oldRelations) {
          if (!newRelations.some(r => r.sourceField === oldField)) {
            const constraintName = `fk_${entryTableName}_${oldField}`;
            const dropConstraintSQL = `
                    DO $$
                    BEGIN
                      IF EXISTS (
                        SELECT 1 FROM information_schema.table_constraints
                        WHERE constraint_name = '${constraintName}'
                        AND table_name = '${entryTableName}'
                      ) THEN
                          ALTER TABLE "${entryTableName}" DROP CONSTRAINT ${constraintName};
                     END IF;
                    END $$;
                  `;
            await queryRunner.query(dropConstraintSQL);
            await queryRunner.query(`ALTER TABLE "${entryTableName}" DROP COLUMN IF EXISTS "${oldField}"`);
          }
        }

        for (const relation of newRelations) {
          if (!oldRelations.includes(relation.sourceField)) {
            const fkType = this.getPostgresFkType(relation.foreignKeyType);
            await queryRunner.query(
              `ALTER TABLE "${entryTableName}" 
                ADD COLUMN IF NOT EXISTS "${relation.sourceField}" ${fkType}`
            );


            const constraintName = `fk_${entryTableName}_${relation.sourceField}`;
            const targetColumn = relation.targetColumn || 'id';
            const onDelete = relation.cascadeDelete ? 'ON DELETE CASCADE' : '';
            const onUpdate = relation.cascadeUpdate ? 'ON UPDATE CASCADE' : '';
            const deferrable = relation.deferrable ? 'DEFERRABLE' : '';

            await queryRunner.query(`
                  DO $$
                  BEGIN
                    IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                      WHERE constraint_name = '${constraintName}'
                      AND table_name = '${entryTableName}'
                    )               THEN
                      ALTER TABLE "${entryTableName}"
                      ADD CONSTRAINT ${constraintName}
                      FOREIGN KEY ("${relation.sourceField}")
                      REFERENCES "${relation.targetTable}"("${targetColumn}")
                     ${onDelete} ${onUpdate} ${deferrable};
                               END IF;
                    END $$;
               `);

          }


        }

        existingEntity.blueprintId = blueprint.id;

      }


      await queryRunner.manager.save(existingEntity);
      await queryRunner.commitTransaction();

      await queryRunner.commitTransaction();

      return { message: 'Dynamic entity updated successfully.' };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to update dynamic entity', err);
    } finally {
      await queryRunner.release();
    }


  }

  async findOne(workspace: Pick<Workspace, "id">, id: number): Promise<DynamicEntity> {

    const dynamicEntity = await this.dynamicEntityRepository.findOne({
      where: { id },
      relations: ['blueprint', 'workspace'],
    });

    if (!dynamicEntity) {
      throw new NotFoundException(`Dynamic entity with ID ${id} not found.`);
    }

    if (dynamicEntity.workspace.id !== workspace.id) {
      throw new BadRequestException('You are not authorized to access this workspace.');
    }

    return dynamicEntity;
  }

  async findOneByName(workspace: Pick<Workspace, "id">, name: string): Promise<DynamicEntity> {

    const dynamicEntity = await this.dynamicEntityRepository.findOne({
      where: { name },
      relations: ['blueprint', 'workspace'],
    });

    if (!dynamicEntity) {
      throw new NotFoundException(`Dynamic entity with NAME ${name} not found.`);
    }

    if (dynamicEntity.workspace.id !== workspace.id) {
      throw new BadRequestException('You are not authorized to access this workspace.');
    }

    return dynamicEntity;
  }

  async findAll(workspace: Pick<Workspace, "id">, queryDto: DynamicEntityListDto): Promise<PaginationResponse<DynamicEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      ...filters
    } = queryDto;

    const query = this.dynamicEntityRepository.createQueryBuilder('dynamic_entity')
      .leftJoin('dynamic_entity.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId: workspace.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('dynamic_entity.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(dynamic_entity.name ILIKE :search OR dynamic_entity.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`dynamic_entity.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('dynamic_entity.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('dynamic_entity.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('dynamic_entity.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('dynamic_entity.updatedAt <= :updatedBefore', { updatedBefore });
    }

    const [data, total] = await query.getManyAndCount();
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      lastPage,
      hasNextPage: page < lastPage,
      hasPrevPage: page > 1,
    };
  }

  async remove(workspace: Pick<Workspace, 'id'>, id: number): Promise<MessageResponse> {

    const dynamicEntity = await this.findOne(workspace, id);
    if (!dynamicEntity) throw new NotFoundException('Dynamic entity not found');

    const queryRunner = this.dataSource.createQueryRunner();
    const name = dynamicEntity.name;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const entryTableName = `${this.TABLE_PREFIX}${name}`;
      await queryRunner.query(`DROP TABLE IF EXISTS "${entryTableName}"`);
      await queryRunner.manager.delete(DynamicEntity, { id });

      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to delete dynamic entity', error);
    } finally {
      await queryRunner.release();
    }

    return { message: `Dynamic entity and table '${name}' deleted successfully.` };
  }


  private generateForeignKeyConstraints(
    relationships: BlueprintRelationshipDto[],
    sourceTable: string
  ): string {
    return relationships.map(relation => {
      const targetColumn = relation.targetColumn || 'id';
      const onDelete = relation.cascadeDelete ? 'ON DELETE CASCADE' : '';
      const onUpdate = relation.cascadeUpdate ? 'ON UPDATE CASCADE' : '';
      const deferrable = relation.deferrable ? 'DEFERRABLE' : '';

      return `CONSTRAINT fk_${sourceTable}_${relation.sourceField} 
      FOREIGN KEY ("${relation.sourceField}") 
      REFERENCES "${relation.targetTable}"("${targetColumn}")
      ${onDelete} ${onUpdate} ${deferrable}`;
    }).join(',\n    ');
  }

  private getPostgresFkType(
    fkType: ForeignKeyType = ForeignKeyType.INT,
  ): string {
    const typeMap = {
      [ForeignKeyType.INT]: 'INTEGER',
      [ForeignKeyType.BIGINT]: 'BIGINT',
      [ForeignKeyType.SMALLINT]: 'SMALLINT',
      [ForeignKeyType.SERIAL]: 'INTEGER',
      [ForeignKeyType.BIGSERIAL]: 'BIGINT',
      [ForeignKeyType.UUID]: 'UUID',
      [ForeignKeyType.INET]: 'INET',
      [ForeignKeyType.MACADDR]: 'MACADDR'
    };

    return typeMap[fkType] || 'INTEGER'; // Default to INTEGER if type not found
  }

  private getPostgresTypeFromField(field: WSBlueprintFieldSchemaDefinition): string {
    const constraints = field.constraints || {};

    switch (field.type) {
      // Numeric Types
      case FieldType.INT:
        return 'INTEGER';
      case FieldType.BIGINT:
        return 'BIGINT';
      case FieldType.SMALLINT:
        return 'SMALLINT';
      case FieldType.FLOAT:
        return constraints.precision ?
          `FLOAT(${constraints.precision})` : 'FLOAT';
      case FieldType.DECIMAL:
        return constraints.precision && constraints.scale ?
          `DECIMAL(${constraints.precision},${constraints.scale})` :
          'DECIMAL';
      case FieldType.SERIAL:
        return 'SERIAL';
      case FieldType.BIGSERIAL:
        return 'BIGSERIAL';

      // Character Types
      case FieldType.STRING:
      case FieldType.VARCHAR:
        return constraints.maxLength ?
          `VARCHAR(${constraints.maxLength})` : 'VARCHAR(255)';
      case FieldType.CHAR:
        return constraints.maxLength ?
          `CHAR(${constraints.maxLength})` : 'CHAR(1)';
      case FieldType.TEXT:
        return 'TEXT';

      // Date/Time Types
      case FieldType.DATE:
        return 'DATE';
      case FieldType.TIME:
        return constraints.withTimeZone ? 'TIME WITH TIME ZONE' : 'TIME';
      case FieldType.TIMESTAMP:
        return constraints.withTimeZone ? 'TIMESTAMP WITH TIME ZONE' : 'TIMESTAMP';
      case FieldType.INTERVAL:
        return 'INTERVAL';

      // Boolean
      case FieldType.BOOLEAN:
        return 'BOOLEAN';

      // Network Address Types
      case FieldType.INET:
        return 'INET';
      case FieldType.CIDR:
        return 'CIDR';
      case FieldType.MACADDR:
        return 'MACADDR';

      // JSON Types
      case FieldType.JSON:
        return 'JSON';
      case FieldType.JSONB:
        return 'JSONB';

      // Special Types
      case FieldType.UUID:
        return 'UUID';
      case FieldType.XML:
        return 'XML';

      // Geometric Types
      case FieldType.POINT:
        return 'POINT';
      case FieldType.LINE:
        return 'LINE';
      case FieldType.LSEG:
        return 'LSEG';
      case FieldType.BOX:
        return 'BOX';
      case FieldType.PATH:
        return 'PATH';
      case FieldType.POLYGON:
        return 'POLYGON';
      case FieldType.CIRCLE:
        return 'CIRCLE';

      // Binary Data
      case FieldType.BYTEA:
        return 'BYTEA';

      // Range Types
      case FieldType.INT4RANGE:
        return 'INT4RANGE';
      case FieldType.INT8RANGE:
        return 'INT8RANGE';
      case FieldType.NUMRANGE:
        return 'NUMRANGE';
      case FieldType.TSRANGE:
        return 'TSRANGE';
      case FieldType.TSTZRANGE:
        return 'TSTZRANGE';
      case FieldType.DATERANGE:
        return 'DATERANGE';

      // Money
      case FieldType.MONEY:
        return 'MONEY';

      // Bit Strings
      case FieldType.BIT:
        return constraints.maxLength ? `BIT(${constraints.maxLength})` : 'BIT(1)';
      case FieldType.VARBIT:
        return constraints.maxLength ? `VARBIT(${constraints.maxLength})` : 'VARBIT';

      // Text Search
      case FieldType.TSVECTOR:
        return 'TSVECTOR';
      case FieldType.TSQUERY:
        return 'TSQUERY';

      // Complex Types
      case FieldType.ARRAY:
      case FieldType.OBJECT:
        return 'JSONB';
      case FieldType.ENUM:
        return 'VARCHAR(255)';

      // Custom Types
      case FieldType.COMPOSITE:
        return constraints.typeName ? constraints.typeName : 'JSONB';
      case FieldType.DOMAIN:
        return constraints.typeName ? constraints.typeName : 'VARCHAR(255)';

      default:
        return 'TEXT'; // Fallback for unknown types
    }
  }



}