import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDepResourceDto } from './create-dep-resource.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDepResourceDto extends PartialType(CreateDepResourceDto) {
    @ApiProperty({ example: 1, description: 'ID of the workspace' })
    @IsNotEmpty()
    @IsNumber()
    workspaceId: number;
}
