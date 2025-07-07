
import { ListQueryDto } from '@/shared-dto/list-query.dto';
import { WorkspaceBaseEntity } from '../../entities/base-workspace.entity';
import { ApiProperty } from '@nestjs/swagger';
import { JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { WorkspaceBaseListDto } from '../../dto/workspace-list.dto';


export class AppListDto extends ListQueryDto {
}


export class AppBaseListDto extends WorkspaceBaseListDto {
    @ApiProperty({ example: 1, description: 'ID of the app' })
    @IsNotEmpty()
    @IsNumber()
    appId: number;
}


