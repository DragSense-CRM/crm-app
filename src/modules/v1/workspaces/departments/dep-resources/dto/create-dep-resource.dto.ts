import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { DepResourceType } from '../enums/dep-resource.enum';
import { ValidateBlueprintDto } from '../../../blueprints/dto/validate-blueprint.dto';

export class CreateDepResourceDto extends ValidateBlueprintDto {


    @ApiProperty({
        example: 'Department Head 1',
        description: 'Department Resource name',
         maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
     @Length(1, 255)
    name: string;


    @ApiProperty({ example: 1, description: 'ID of the resource' })
    @IsNotEmpty()
    @IsNumber()
    resourceId: number;

    @ApiProperty({ example: true, description: 'Whether the resource is active in this department' })
    @IsBoolean()
    isActive: boolean;

    @ApiPropertyOptional({ example: 'Manager', description: 'Designation in department', required: false })
    @IsOptional()
    @IsString()
    designation?: string;

    @IsString()
    @ApiPropertyOptional({
        enum: DepResourceType,
        example: DepResourceType.USER,
        description: 'Type of the resource linked to the department',
    })
    type?: string;
}
