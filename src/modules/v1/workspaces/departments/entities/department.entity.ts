import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
  ManyToOne, ManyToMany, JoinTable
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceWithBlueprintEntity } from '../../entities/base-workspace.entity';
import { Project } from '../projects/entities/project.entity';

@Entity('ws-departments')
export class Department extends WorkspaceWithBlueprintEntity {

  @ApiProperty({ example: 'Engineering', description: 'Department name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiPropertyOptional({
    example: 'Product development team',
    description: 'Department description'
  })
  @Column({ nullable: true })
  description: string;

  @ApiPropertyOptional({
    example: 'ENG',
    description: 'Department code/short name'
  })
  @Column({ nullable: true, unique: true })
  code: string;



  @ApiProperty({
    type: () => [Project],
    description: 'Projects owned by department'
  })
  @OneToMany(() => Project, project => project.department)
  projects: Project[];




}