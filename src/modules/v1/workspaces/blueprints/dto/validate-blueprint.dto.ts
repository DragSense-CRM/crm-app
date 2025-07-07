import { IsNotEmpty, IsUUID, IsArray, ValidateNested, IsOptional, IsMongoId, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldDto } from './field.dto';
import { BlueprintRelationshipDto } from './relationship.dto';

export class ValidateBlueprintDto {
    @ApiProperty({
        description: 'The ID of the blueprint to validate against',
        example: 'a7e9b4d1-23f4-47ad-bd9c-ccf6d17867bb',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsMongoId()
    blueprintId?: string;

    @ApiProperty({
        description: 'Array of field values to validate',
        type: [FieldDto],
        required: false,
    })
    @ValidateIf((o) => !!o.blueprintId)
    @Transform(({ value }) => (value === '' ? {} : value))
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FieldDto)
    values: FieldDto[];


    @ApiPropertyOptional({
        description: 'List of relationships to validate',
        type: [BlueprintRelationshipDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BlueprintRelationshipDto)
    relationships?: BlueprintRelationshipDto[];
}
