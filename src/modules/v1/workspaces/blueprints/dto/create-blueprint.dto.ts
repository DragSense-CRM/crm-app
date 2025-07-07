import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, Length, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FieldDto } from './field.dto';
import { BlueprintRelationshipDto } from './relationship.dto';


export class CreateBlueprintDto {
    @ApiProperty({
        example: 'User Profile WSBlueprint',
        description: 'Unique name for the blueprint',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        example: 'This blueprint defines fields for a user registration form.',
        description: 'Description of what the blueprint represents',
        maxLength: 1000,
    })
    @IsString()
    @MaxLength(1000)
    description: string;

    @ApiPropertyOptional({
        type: [FieldDto],
        description: 'List of fields included in the blueprint',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FieldDto)
    fields?: FieldDto[];


    @ApiPropertyOptional({ type: [BlueprintRelationshipDto], required: false, description: 'List of relationships included in the blueprint' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BlueprintRelationshipDto)
    relationships?: BlueprintRelationshipDto[];
}
