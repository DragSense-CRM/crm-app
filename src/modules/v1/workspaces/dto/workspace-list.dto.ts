
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';


import { ListQueryDto } from '@/shared-dto/list-query.dto';

export class WorkspaceListDto extends ListQueryDto {
}


export class WorkspaceBaseListDto extends ListQueryDto {
    @ApiProperty({ example: 1, description: 'ID of the workspace' })
    @IsNotEmpty()
    @IsNumber()
    workspaceId: number;
}