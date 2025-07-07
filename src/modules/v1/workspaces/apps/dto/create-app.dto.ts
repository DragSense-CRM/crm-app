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
import { ValidateBlueprintFieldsDto } from '../../blueprints/dto/validate-blueprint-fields.dto';

export class CreateAppDto extends ValidateBlueprintFieldsDto {
  @ApiProperty({ example: 'HR APP', description: 'Name of the app', maxLength: 1000, })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ example: 'Admin Dashboard for HR', description: 'Description of the app', maxLength: 1000, })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

}