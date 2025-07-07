import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Workspace } from '../../entities/workspace.entity';


import { CreateDynamicEntitiesRecordDto } from './dto/create-dynamic-entities-record.dto';
import { UpdateDynamicEntitiesRecordDto } from './dto/update-dynamic-entities-record.dto';
import { DynamicEntitiesRecordListDto } from './dto/dynamic-entities-record-list.dto';
import { BlueprintsService } from '../../blueprints/blueprints.service';
import { DynamicEntitiesService } from '../dynamic-entities.service';
import { DynamicEntity } from '../entities/dynamic-entity.entity';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

@Injectable()
export class DynamicEntitiesRecordService {
  constructor(
    private readonly blueprintService: BlueprintsService,
    private readonly dynamicEntitiesService: DynamicEntitiesService,
    private readonly dataSource: DataSource,
  ) { }

  async create(
    workspace: Pick<Workspace, 'id'>,
    dynamicEntity: DynamicEntity,
    createDto: CreateDynamicEntitiesRecordDto,
  ): Promise<MessageResponse> {


    if (!dynamicEntity.blueprintId)
      throw new BadRequestException('Dynamic entity has no blueprint');


    const tableName = this.getTableName(dynamicEntity.name);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      const blueprint = await this.blueprintService.findOne(
        workspace,
        dynamicEntity.blueprintId,
      );

      const fields = blueprint.fields || [];
      const relationships = blueprint.relationships || [];
      const allColumns = [
        ...fields,
        ...relationships.map((r) => ({ key: r.sourceField })),
      ];

      const payload = createDto.values || {};
      const columns = ['id', 'created_at', 'updated_at', 'workspace_id'];
      const values = ['uuid_generate_v4()', 'NOW()', 'NOW()', '$1'];
      const params = [workspace.id];

      for (const columnDef of allColumns) {
        const key = columnDef.key;
        if (key in payload) {
          columns.push(`"${key}"`);
          values.push(`$${params.length + 1}`);
          params.push(payload[key]);
        }
      }

      const insertSQL = `INSERT INTO "${tableName}" (${columns.join(
        ', ',
      )}) VALUES (${values.join(', ')})`;
      await queryRunner.query(insertSQL, params);

      await queryRunner.commitTransaction();
      return { message: 'Record created successfully.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to create record',
        err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    workspace: Pick<Workspace, 'id'>,
    dynamicEntity: DynamicEntity,
    queryDto: DynamicEntitiesRecordListDto,
  ): Promise<PaginationResponse<any>> {


    if (!dynamicEntity.blueprintId)
      throw new BadRequestException('Dynamic entity has no blueprint');


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

    const tableName = this.getTableName(dynamicEntity.name);
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      let query = `SELECT * FROM "${tableName}" WHERE workspace_id = $1`;
      let countQuery = `SELECT COUNT(*) FROM "${tableName}" WHERE workspace_id = $1`;
      const params: any[] = [workspace.id];
      let paramCount = 1;

      if (search) {
        const blueprint = await this.blueprintService.findOne(
          workspace,
          dynamicEntity.blueprintId,
        );
        const textFields = blueprint.fields
          .filter((f) => f.type === 'text' || f.type === 'string')
          .map((f) => f.key);

        if (textFields.length > 0) {
          const searchConditions = textFields
            .map((field) => `"${field}" ILIKE $${paramCount + 1}`)
            .join(' OR ');
          query += ` AND (${searchConditions})`;
          countQuery += ` AND (${searchConditions})`;
          params.push(`%${search}%`);
          paramCount++;
        }
      }

      // Add filter conditions
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          paramCount++;
          query += ` AND "${key}" = $${paramCount}`;
          countQuery += ` AND "${key}" = $${paramCount}`;
          params.push(value);
        }
      }

      // Date filters
      if (createdAfter) {
        paramCount++;
        query += ` AND created_at >= $${paramCount}`;
        countQuery += ` AND created_at >= $${paramCount}`;
        params.push(new Date(createdAfter));
      }

      if (createdBefore) {
        paramCount++;
        query += ` AND created_at <= $${paramCount}`;
        countQuery += ` AND created_at <= $${paramCount}`;
        params.push(new Date(createdBefore));
      }

      if (updatedAfter) {
        paramCount++;
        query += ` AND updated_at >= $${paramCount}`;
        countQuery += ` AND updated_at >= $${paramCount}`;
        params.push(new Date(updatedAfter));
      }

      if (updatedBefore) {
        paramCount++;
        query += ` AND updated_at <= $${paramCount}`;
        countQuery += ` AND updated_at <= $${paramCount}`;
        params.push(new Date(updatedBefore));
      }

      // Add pagination
      query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(limit, (page - 1) * limit);

      // Execute queries
      const records = await queryRunner.query(query, params);
      const countResult = await queryRunner.query(countQuery, params.slice(0, paramCount));
      const total = parseInt(countResult[0].count, 10);
      const lastPage = Math.ceil(total / limit);

      return {
        data: records,
        total,
        page,
        limit,
        lastPage,
        hasNextPage: page < lastPage,
        hasPrevPage: page > 1,
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to fetch records',
        err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(
    workspace: Pick<Workspace, 'id'>,
    dynamicEntity: DynamicEntity,
    recordId: string,
  ): Promise<any> {

    if (!dynamicEntity.blueprintId)
      throw new BadRequestException('Dynamic entity has no blueprint');


    const tableName = this.getTableName(dynamicEntity.name);
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      const query = `SELECT * FROM "${tableName}" WHERE id = $1 AND workspace_id = $2`;
      const result = await queryRunner.query(query, [recordId, workspace.id]);

      if (result.length === 0) {
        throw new NotFoundException('Record not found');
      }

      return result[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        'Failed to fetch record',
        err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    workspace: Pick<Workspace, 'id'>,
    dynamicEntity: DynamicEntity,
    recordId: string,
    updateDto: UpdateDynamicEntitiesRecordDto,
  ): Promise<MessageResponse> {

    if (!dynamicEntity.blueprintId)
      throw new BadRequestException('Dynamic entity has no blueprint');


    const tableName = this.getTableName(dynamicEntity.name);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify record exists
      const existing = await this.findOne(workspace, dynamicEntity, recordId);

      const blueprint = await this.blueprintService.findOne(
        workspace,
        dynamicEntity.blueprintId,
      );
      const fields = blueprint.fields || [];
      const relationships = blueprint.relationships || [];
      const allColumns = [
        ...fields,
        ...relationships.map((r) => ({ key: r.sourceField })),
      ];

      const payload = updateDto.values || {};
      const updates: any[] = [];
      const params: any[] = [recordId, workspace.id];
      let paramCount = 2;

      // Build update clauses
      for (const columnDef of allColumns) {
        const key = columnDef.key;
        if (key in payload) {
          updates.push(`"${key}" = $${paramCount + 1}`);
          params.push(payload[key]);
          paramCount++;
        }
      }

      if (updates.length === 0) {
        throw new BadRequestException('No valid fields provided for update');
      }

      const updateSQL = `UPDATE "${tableName}" SET ${updates.join(
        ', ',
      )}, updated_at = NOW() WHERE id = $1 AND workspace_id = $2`;
      await queryRunner.query(updateSQL, params);

      await queryRunner.commitTransaction();
      return { message: 'Record updated successfully.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException || err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(
        'Failed to update record',
        err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(
    workspace: Pick<Workspace, 'id'>,
    dynamicEntity: DynamicEntity,
    recordId: string,
  ): Promise<MessageResponse> {


    const tableName = this.getTableName(dynamicEntity.name);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify record exists
      await this.findOne(workspace, dynamicEntity, recordId);

      const deleteSQL = `DELETE FROM "${tableName}" WHERE id = $1 AND workspace_id = $2`;
      await queryRunner.query(deleteSQL, [recordId, workspace.id]);

      await queryRunner.commitTransaction();
      return { message: 'Record deleted successfully.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        'Failed to delete record',
        err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private getTableName(entityName: string): string {
    return `${this.dynamicEntitiesService.TABLE_PREFIX}${entityName}`;
  }
}