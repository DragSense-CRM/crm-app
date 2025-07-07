import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';

import { Department } from '../entities/department.entity';


export class DepartmentPaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Department] })
  @Type(() => Department)
  data: Department[];
}