import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsNumber, ValidateIf, IsNotEmpty, IsString, Length, MaxLength, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateBlueprintDto } from '../../blueprints/dto/create-blueprint.dto';

export class CreateDynamicEntityDto {


    @ApiProperty({
        example: 'new_entity',
        description: 'Unique name for the dynamic entity (letters, numbers, underscores only). Must start with a letter.',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty({ message: 'Table name must not be empty' })
    @Transform(({ value }) => value.trim())
    @Length(1, 50, { message: 'Table name must be between 1 and 50 characters' })
    @Matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
        message: 'Table name must start with a letter and only contain letters, numbers, and underscores',
    })
    name: string;


    @ApiPropertyOptional({
        description: 'Optional description for the dynamic entity',
        example: 'Record of all custom users',
        required: false,
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiPropertyOptional({
        type: 'number',
        description: 'Existing blueprint ID (required if not providing newBlueprint)',
        example: 4
    })
    @IsString()
    @ValidateIf(o => !o.newBlueprint)
    @IsNotEmpty({ message: 'Either blueprintId or newBlueprint must be provided' })
    blueprintId?: string;

    @ApiPropertyOptional({
        type: CreateBlueprintDto,
        description: 'New blueprint (required if not providing blueprintId)',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateBlueprintDto)
    @ValidateIf(o => !o.blueprintId)
    @IsNotEmpty({ message: 'Either blueprintId or newBlueprint must be provided' })
    newBlueprint?: CreateBlueprintDto;


    @ApiProperty({ example: 1, description: 'ID of the department' })
    @IsOptional()
    @IsNumber()
    departmentId: number;

    @ApiProperty({ example: 1, description: 'ID of the project' })
    @IsOptional()
    @IsNumber()
    projectId: number;

    @ApiProperty({ example: 1, description: 'ID of the app' })
    @IsOptional()
    @IsNumber()
    appId: number;
}