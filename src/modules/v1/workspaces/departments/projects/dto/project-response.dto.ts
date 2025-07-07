import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';

import { Project } from '../entities/project.entity';


export class ProjectPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Project] })
  @Type(() => Project)
  data: Project[];
}