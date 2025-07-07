import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { ValidateBlueprintDto } from '@/modules/v1/workspaces/blueprints/dto/validate-blueprint.dto';

export class CreateProjResourceDto extends ValidateBlueprintDto {

    @ApiProperty({
        example: 'Project Head 1',
        description: 'Project Resource name',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiProperty({ example: 1, description: 'ID of the department resource' })
    @IsNotEmpty()
    @IsNumber()
    depReourceId: number;

    @ApiPropertyOptional({ example: 'Project Manager', description: 'Role in project', required: false })
    @IsOptional()
    @IsString()
    role?: string;

}
