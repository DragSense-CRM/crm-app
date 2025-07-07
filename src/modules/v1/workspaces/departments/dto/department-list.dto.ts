
import { ListQueryDto } from '@/shared-dto/list-query.dto';
import { WorkspaceBaseEntity } from '../../entities/base-workspace.entity';
import { ApiProperty } from '@nestjs/swagger';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Department } from '../entities/department.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { WorkspaceBaseListDto } from '../../dto/workspace-list.dto';


export class DepartmentListDto extends ListQueryDto {
}


export class DepartmentBaseListDto extends WorkspaceBaseListDto {
    @ApiProperty({ example: 1, description: 'ID of the department' })
    @IsNotEmpty()
    @IsNumber()
    departmentId: number;
}


