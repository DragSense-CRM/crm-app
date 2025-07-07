import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsUrl,
  ValidateIf,
  IsDateString,

  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceType, FileType } from '../enums/resource.enum';
import { ValidateBlueprintDto } from '../../blueprints/dto/validate-blueprint.dto';
import { Transform, Type } from 'class-transformer';
import { UserGender } from '@/modules/v1/users/enums/user.enum';



export class CreateResourceDto extends ValidateBlueprintDto {
  @ApiProperty({
    example: 'Cement Stock',
    description: 'Name of the resource',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ResourceType.FILE,
    description: 'High-level category of the resource',
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    example: 'Stock for phase 1 construction',
    description: 'Optional description of the resource',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 42,
    description: 'Optional parent resource ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentResourceId?: number;

  @ApiPropertyOptional({
    example: 34,
    description: 'Age of resource'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 10.5, description: 'Weight in kilograms' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 5.2, description: 'Length in meters' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 3, description: 'Width in meters' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 2, description: 'Height in meters' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    example: 3600,
    description: 'Duration in seconds'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Quantity or count'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Manufacturing or creation date'
  })
  @IsOptional()
  @IsDateString()
  manufactureDate?: Date;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Expiration date'
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @ApiPropertyOptional({
    example: 'ABC123',
    description: 'Serial number or identifier'
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({
    example: 'XYZ Corporation',
    description: 'Manufacturer or provider'
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    example: 'https://storage.com/files/project-specs.pdf',
    description: 'URL of the file (required if type is FILE and no file is uploaded)'
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  fileUrl?: string;

  @ApiPropertyOptional({ enum: FileType, example: FileType.DOCUMENT })
  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @ApiPropertyOptional({ example: 1024 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size?: number;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any;



  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: 'email@example.com', description: 'User email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: 'secrete', description: 'User password' })
  @IsString()
  @Length(6, 100)
  password: string;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: 'male', description: 'Gender of the user' })
  @IsEnum(UserGender, { message: 'Gender must be one of Male, Female, or Other' })
  @IsOptional()
  gender: UserGender;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({ example: '123 Main St', description: 'Street address' })
  @IsString()
  @IsOptional()
  address: string;

  @ValidateIf((o) => o.type === ResourceType.USER)
  @ApiPropertyOptional({
    example: '+1-202-555-0173',
    description: 'Contact phone number',
  })
  @IsString()
  @IsOptional()
  contactPhone: string;
}
