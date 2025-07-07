import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { ForeignKeyType, RelationType } from '../enums/relation.enum';

export class BlueprintRelationshipDto {
  @ApiProperty({ example: 'assignedUserId' })
  @IsString()
  sourceField: string;

  @ApiProperty({ example: 'app_123_users', description: 'Target table name in DB' })
  @IsString()
  targetTable: string;

  @ApiProperty({ enum: RelationType })
  @IsEnum(RelationType)
  relationType: RelationType;

  @ApiPropertyOptional({ type: Boolean, description: 'Is relationship required?' })
  @IsOptional()
  @IsBoolean()
  required?: boolean = false;

  @ApiPropertyOptional({
    example: 'id',
    description: 'Defaults to primary key of target table if not specified'
  })
  @IsString()
  @IsOptional()
  targetColumn?: string;

  @ApiPropertyOptional({
    enum: ForeignKeyType,
    description: 'Type of foreign key column',
    example: ForeignKeyType.UUID
  })
  @IsEnum(ForeignKeyType)
  @IsOptional()
  foreignKeyType?: ForeignKeyType;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable ON DELETE CASCADE behavior'
  })
  @IsBoolean()
  @IsOptional()
  cascadeDelete?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable ON UPDATE CASCADE behavior'
  })
  @IsBoolean()
  @IsOptional()
  cascadeUpdate?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable DEFERRABLE behavior'
  })
  @IsBoolean()
  @IsOptional()
  deferrable?: boolean;
}
