import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';

import { Task } from '../entities/task.entity';


export class TaskPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Task] })
  @Type(() => Task)
  data: Task[];
}