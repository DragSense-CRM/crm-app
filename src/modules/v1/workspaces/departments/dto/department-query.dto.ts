
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class DepartmentBaseQueryDto {
    @ApiProperty({ example: 1, description: 'ID of the department' })
    @IsNotEmpty()
    @IsNumber()
    departmentId: number;
}


