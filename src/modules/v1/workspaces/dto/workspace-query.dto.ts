
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class WorkspacQueryDto {
}



export class WorkspaceBaseQueryDto {
    @ApiProperty({ example: 1, description: 'ID of the workspace' })
    @IsNotEmpty()
    @IsNumber()
    workspaceId: number;
}


