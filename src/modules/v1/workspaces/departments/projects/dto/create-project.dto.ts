import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString, IsNotEmpty, IsOptional, IsDateString,
    IsEnum, IsNumber, Min, Max, IsInt,
    IsMongoId,
    Length,
    MaxLength,
    ValidateNested
} from 'class-validator';
import {
    ProjectCompletionStatus,
    ProjectPriority,
    ProjectStage,
    ProjectType
} from '../enums/project.enum';
import { ValidateBlueprintDto } from '../../../blueprints/dto/validate-blueprint.dto';
import { CreateAppDto } from '../../../apps/dto/create-app.dto';
import { Type } from 'class-transformer';

export class CreateProjectDto extends ValidateBlueprintDto {
    @ApiProperty({
        example: 'E-Commerce Platform',
        description: 'Project name',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @ApiPropertyOptional({
        example: 'Development of online shopping platform',
        description: 'Project description',
        maxLength: 1000,
    })
    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @ApiProperty({
        enum: ProjectType,
        example: ProjectType.ADMINISTRATION,
        description: 'Type of project'
    })
    @IsEnum(ProjectType)
    type: ProjectType;

    @ApiProperty({
        enum: ProjectPriority,
        example: ProjectPriority.MEDIUM,
        description: 'Priority level',
        default: ProjectPriority.MEDIUM
    })
    @IsEnum(ProjectPriority)
    @IsOptional()
    priority?: ProjectPriority = ProjectPriority.MEDIUM;

    @ApiProperty({
        enum: ProjectStage,
        example: ProjectStage.PLANNING,
        description: 'Current project phase',
        default: ProjectStage.PLANNING
    })
    @IsEnum(ProjectStage)
    @IsOptional()
    stage?: ProjectStage = ProjectStage.PLANNING;

    @ApiProperty({
        enum: ProjectCompletionStatus,
        example: ProjectCompletionStatus.ON_TRACK,
        description: 'Project completion health status',
        default: ProjectCompletionStatus.ON_TRACK
    })
    @IsEnum(ProjectCompletionStatus)
    @IsOptional()
    completionStatus?: ProjectCompletionStatus = ProjectCompletionStatus.ON_TRACK;

    @ApiPropertyOptional({
        example: 0,
        description: 'Percentage completion (0-100)',
        minimum: 0,
        maximum: 100
    })
    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    completionPercentage?: number = 0;

    @ApiPropertyOptional({
        example: '2023-01-01',
        description: 'Project start date'
    })
    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @ApiPropertyOptional({
        example: '2023-12-31',
        description: 'Project deadline'
    })
    @IsDateString()
    @IsOptional()
    deadline?: Date;

    @ApiPropertyOptional({
        example: 50000.00,
        description: 'Project budget'
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    budget?: number;


    @ApiPropertyOptional({
        type: 'number',
        description: 'Existing app ID to link (optional)',
        example: 4
    })
    @IsNumber()
    @IsOptional()
    appId?: number;

    @ApiPropertyOptional({
        type: CreateAppDto,
        description: 'New app creation details (optional)',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAppDto)
    newApp?: CreateAppDto;
}