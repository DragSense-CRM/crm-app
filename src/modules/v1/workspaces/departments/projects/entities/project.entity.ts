import { Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Task } from '../tasks/entities/task.entity';
import { ProjectCompletionStatus, ProjectPriority, ProjectStage, ProjectType } from '../enums/project.enum';

import { DepartmentWithBlueprintEntity } from '../../entities/base-department.entity';
import { App } from '../../../apps/entities/app.entity';


@Entity('ws-projects')
export class Project extends DepartmentWithBlueprintEntity {
    @ApiProperty({ example: 'E-Commerce Platform', description: 'Project name' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        example: 'Development of online shopping platform',
        description: 'Project description',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        enum: ProjectType,
        example: ProjectType.SOFTWARE,
        description: 'Type of project'
    })
    @Column({ enum: ProjectType, type: 'text', default: ProjectType.OTHER })
    type: string;

    @ApiProperty({
        example: 'Web Application',
        description: 'Subtype of project',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    subtype: string;

    @ApiProperty({
        enum: ProjectPriority,
        example: ProjectPriority.MEDIUM,
        description: 'Priority level'
    })
    @Column({ type: 'enum', enum: ProjectPriority, default: ProjectPriority.MEDIUM })
    priority: ProjectPriority;

    @ApiProperty({
        enum: ProjectStage,
        example: ProjectStage.PLANNING,
        description: 'Current project phase'
    })
    @Column({ type: 'enum', enum: ProjectStage, default: ProjectStage.PLANNING })
    stage: ProjectStage;

    @ApiProperty({
        enum: ProjectCompletionStatus,
        example: ProjectCompletionStatus.ON_TRACK,
        description: 'Project completion health status'
    })
    @Column({
        type: 'enum',
        enum: ProjectCompletionStatus,
        default: ProjectCompletionStatus.ON_TRACK
    })
    completionStatus: ProjectCompletionStatus;

    @ApiPropertyOptional({
        example: 75,
        description: 'Percentage completion (0-100)',
        minimum: 0,
        maximum: 100
    })
    @Column({ type: 'smallint', nullable: true })
    completionPercentage: number;

    @ApiProperty({
        example: '2023-01-01',
        description: 'Project start date',
        required: false
    })
    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @ApiProperty({
        example: '2023-12-31',
        description: 'Project deadline',
        required: false
    })
    @Column({ type: 'date', nullable: true })
    deadline: Date;

    @ApiProperty({
        example: 50000.00,
        description: 'Project budget',
        required: false
    })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    budget: number;

    @ApiProperty({
        type: () => [Task],
        description: 'Tasks associated with this project',
        required: false
    })
    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[];



    @ApiProperty({ type: () => App, required: false, description: 'App associated with this project' })
    @ManyToOne(() => App, app => app.projects, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    app: App | null;
}