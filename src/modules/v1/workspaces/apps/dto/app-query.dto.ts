
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class AppBaseQueryDto {
    @ApiProperty({ example: 1, description: 'ID of the app' })
    @IsNotEmpty()
    @IsNumber()
    appId: number;
}


