import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceWithBlueprintEntity } from '../../entities/base-workspace.entity';

import { FileType, ResourceType } from '../enums/resource.enum';
import { Type } from 'class-transformer';
import { User } from '@/modules/v1/users/entities/user.entity';
@Entity('ws-resources')
export class Resource extends WorkspaceWithBlueprintEntity {
  @ApiProperty({ example: 'Cement Stock' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    enum: ResourceType,
    example: ResourceType.FILE,
    description: 'Type of resource'
  })
  @Column({ type: 'text', default: ResourceType.OTHER })
  type: string;

  @ApiPropertyOptional()
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiPropertyOptional({ type: () => Resource })
  @ManyToOne(() => Resource, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentResourceId' })
  parentResource?: Resource;

  @Column({ nullable: true })
  parentResourceId?: number;

  @ApiPropertyOptional({
    example: 34,
    description: 'Age of resource'
  })
  @Column('int', { nullable: true })
  @Type(() => String)
  age?: number;

  @ApiPropertyOptional({ example: 10.5, description: 'Weight in kilograms' })
  @Column('float', { nullable: true })
  weight?: number;

  @ApiPropertyOptional({ example: 5.2, description: 'Length in meters' })
  @Column('float', { nullable: true })
  length?: number;

  @ApiPropertyOptional({ example: 3, description: 'Width in meters' })
  @Column('float', { nullable: true })
  width?: number;

  @ApiPropertyOptional({ example: 2, description: 'Height in meters' })
  @Column('float', { nullable: true })
  height?: number;

  @ApiPropertyOptional({
    example: 3600,
    description: 'Duration in seconds'
  })
  @Column('int', { nullable: true })
  duration?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Quantity or count'
  })
  @Column('int', { nullable: true })
  quantity?: number;

  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Manufacturing or creation date'
  })
  @Column('date', { nullable: true })
  manufactureDate?: Date;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Expiration date'
  })
  @Column('date', { nullable: true })
  expiryDate?: Date;

  @ApiPropertyOptional({
    example: 'ABC123',
    description: 'Serial number or identifier'
  })
  @Column({ nullable: true })
  serialNumber?: string;

  @ApiPropertyOptional({
    example: 'XYZ Corporation',
    description: 'Manufacturer or provider'
  })
  @Column({ nullable: true })
  manufacturer?: string;

  @ApiProperty({ example: 'https://storage.com/files/project-specs.pdf' })
  @Column()
  fileUrl: string;

  @ApiProperty({ enum: FileType, example: FileType.DOCUMENT })
  @Column({ type: 'enum', enum: FileType })
  fileType?: FileType;

  @ApiProperty({ example: 1024 })
  @Column('float')
  size?: number;

  @ApiProperty({ example: 'application/pdf' })
  @Column()
  mimeType: string;


  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;
}