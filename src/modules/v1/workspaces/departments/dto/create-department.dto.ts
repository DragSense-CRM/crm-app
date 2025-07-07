import {
  ApiProperty, ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional,
  IsNumber, IsArray,
  IsMongoId,
  Length,
  MaxLength
} from 'class-validator';
import { ValidateBlueprintDto } from '../../blueprints/dto/validate-blueprint.dto';

export class CreateDepartmentDto extends ValidateBlueprintDto {
  @ApiProperty({ example: 'Engineering', description: 'Department name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ example: 'Product development team', description: 'Department description', maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'ENG' })
  @IsString()
  @IsOptional()
  code?: string;

}