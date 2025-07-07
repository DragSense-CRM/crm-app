// relationships.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BlueprintRelationshipDto } from './dto/relationship.dto';

@Injectable()
export class RelationshipsService {
  constructor(private readonly dataSource: DataSource) {}

  async validateRelationship(
    relationship: BlueprintRelationshipDto
  ): Promise<string[]> {
    const errors: string[] = [];

    // Basic structure checks
    if (!relationship.sourceField) {
      errors.push('sourceField is required');
    }

    if (!relationship.targetTable) {
      errors.push('targetTable is required');
    }

    if (!relationship.relationType) {
      errors.push('relationType is required');
    }

    // Optional: Deep validation with actual database schema
    if (relationship.targetTable) {
      const tableExists = await this.checkTableExists(relationship.targetTable);
      if (!tableExists) {
        errors.push(`Target table "${relationship.targetTable}" does not exist`);
      } else if (relationship.targetColumn) {
        const columnExists = await this.checkColumnExists(
          relationship.targetTable,
          relationship.targetColumn
        );
        if (!columnExists) {
          errors.push(
            `Column "${relationship.targetColumn}" does not exist in table "${relationship.targetTable}"`
          );
        }
      }
    }

    return errors;
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      ) AS "exists"
    `, [tableName]);

    return result[0]?.exists === true;
  }

  private async checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      ) AS "exists"
    `, [tableName, columnName]);

    return result[0]?.exists === true;
  }
}
