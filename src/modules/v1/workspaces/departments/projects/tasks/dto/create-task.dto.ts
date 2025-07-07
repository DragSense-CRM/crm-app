import {
  ApiProperty, ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsDateString,
  IsEnum, IsInt, Min, Max, IsArray, IsMongoId,
  IsNumber,
  ArrayUnique,
  MaxLength,
  Length
} from 'class-validator';
import {
  TaskPriority,
  TaskStatus,
  TaskType
} from '../enums/task.enum';
import { ValidateBlueprintDto } from '@/modules/v1/workspaces/blueprints/dto/validate-blueprint.dto';

export class CreateTaskDto extends ValidateBlueprintDto {
  @ApiProperty({
    example: 'Implement payment gateway',
    description: 'Task title',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiPropertyOptional({
    example: 'Integrate Stripe API with proper error handling',
    description: 'Task description',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    enum: TaskType,
    example: TaskType.FEATURE,
    description: 'Type of task',
    default: TaskType.FEATURE
  })
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType = TaskType.FEATURE;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Initial status',
    default: TaskStatus.TODO
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: 'Priority level',
    default: TaskPriority.MEDIUM
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({
    example: 2,
    description: 'Story points estimate',
    minimum: 0
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  storyPoints?: number;

  @ApiPropertyOptional({
    example: '2023-06-15',
    description: 'Planned start date'
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2023-06-30',
    description: 'Task deadline'
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({
    example: 0,
    description: 'Initial completion percentage',
    minimum: 0,
    maximum: 100
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  completionPercentage?: number = 0;


  @ApiPropertyOptional({
    description: 'ID of the assigned resource (assignee)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  assigneeId?: number;

  @ApiPropertyOptional({
    description: 'IDs of collaborator resources',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  collaboratorIds?: number[];

}