import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from '@/shared-dto/pagination.dto';

import { Workspace } from '../entities/workspace.entity';


export class WorkspacePaginatedDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Workspace] })
  @Type(() => Workspace)
  data: Workspace[];
}