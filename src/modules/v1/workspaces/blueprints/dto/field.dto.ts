import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { FieldType } from '../enums/field.enum';


export class FieldItemDto {
  @ApiProperty({ type: String, example: 'username' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiPropertyOptional({ type: Boolean, description: 'Is field required?' })
  @IsOptional()
  @IsBoolean()
  required?: boolean = false;

  @ApiPropertyOptional({ type: String, example: 'John Doe' })
  @IsOptional()
  @IsNotEmpty()
  defaultValue: string | null = null;
}

export class FieldConstraintsDto {

  @ApiPropertyOptional({ type: Number, description: 'Minimum string length' })
  @IsOptional() @IsNumber()
  minLength?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum string length' })
  @IsOptional() @IsNumber()
  maxLength?: number;

  @ApiPropertyOptional({ type: String, description: 'Regex pattern for strings' })
  @IsOptional() @IsString()
  pattern?: string;

  @ApiPropertyOptional({ type: [String], description: 'List of allowed enum values' })
  @IsOptional()
  enum?: string[];

  @ApiPropertyOptional({ type: Number, description: 'Minimum number value' })
  @IsOptional() @IsNumber()
  minimum?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum number value' })
  @IsOptional() @IsNumber()
  maximum?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Must be an integer?' })
  @IsOptional() @IsBoolean()
  integer?: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Minimum ISO date' })
  @IsOptional() @IsString()
  minDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Maximum ISO date' })
  @IsOptional() @IsString()
  maxDate?: string;

  @ApiPropertyOptional({ type: Number, description: 'Minimum number of array items' })
  @IsOptional() @IsNumber()
  minItems?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum number of array items' })
  @IsOptional() @IsNumber()
  maxItems?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Array must contain unique items' })
  @IsOptional() @IsBoolean()
  uniqueItems?: boolean;

  @ApiPropertyOptional({ type: () => FieldItemDto, description: 'Nested item definition for array/object' })
  @IsOptional()
  @ValidateNested()
  @Type(() => FieldItemDto)
  items?: FieldItemDto;
}


export class FieldDto extends FieldItemDto {
  @ApiPropertyOptional({ type: () => FieldConstraintsDto, description: 'Field-specific constraints' })
  @IsOptional()
  @ValidateNested()
  @Type(() => FieldConstraintsDto)
  constraints?: FieldConstraintsDto;
}
