import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ForeignKeyType, RelationType } from '../enums/relation.enum';
import { IsOptional, IsString } from 'class-validator';


export class WSBlueprintRelationshipSchemaDefinition {
    @ApiProperty({ example: 'assignedUserId' })
    @Prop({ required: true })
    sourceField: string;

    @ApiProperty({ example: 'app_123_users', description: 'Target table name in DB' })
    @Prop({ required: true })
    targetTable: string;

    @ApiProperty({ enum: RelationType })
    @Prop({ required: true, enum: RelationType })
    relationType: RelationType;

    @ApiPropertyOptional({ default: false })
    @Prop({ default: false })
    required: boolean;

    @ApiPropertyOptional({ example: 'id' })
    @Prop({ default: 'id' })
    targetColumn?: string;

    @ApiPropertyOptional({ example: ForeignKeyType.UUID, enum: ForeignKeyType, description: 'Type of the target column (used to define FK column type)' })
    @Prop({ default: ForeignKeyType.INT })
    foreignKeyType?: ForeignKeyType;

    @ApiPropertyOptional({ example: true })
    @Prop({ default: false })
    cascadeDelete?: boolean

    @ApiPropertyOptional({ example: true })
    @Prop({ default: false })
    cascadeUpdate?: boolean

    @ApiPropertyOptional({ example: true })
    @Prop({ default: false })
    deferrable?: boolean
}
