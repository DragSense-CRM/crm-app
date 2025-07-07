import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    CreateDateColumn, UpdateDateColumn, ManyToMany,
    JoinTable, OneToMany, JoinColumn
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectWithBlueprintEntity } from '../../entities/base-project.entity';


import { TaskPriority, TaskStatus, TaskType } from '../enums/task.enum';
import { ProjResource } from '../../proj-resources/entities/proj-resource.entity';


@Entity('ws-tasks')
export class Task extends ProjectWithBlueprintEntity {
    @ApiProperty({ example: 'Implement payment gateway', description: 'Task title' })
    @Column({type: 'varchar', length: 255 })
    title: string;

    @ApiPropertyOptional({
        example: 'Integrate Stripe API with proper error handling',
        description: 'Detailed task description'
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        enum: TaskType,
        example: TaskType.FEATURE,
        description: 'Type of task'
    })
    @Column({ type: 'text', enum: TaskType, default: TaskType.OTHER })
    type: string;

    @ApiProperty({
        enum: TaskStatus,
        example: TaskStatus.TODO,
        description: 'Current status',
        default: TaskStatus.TODO
    })
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @ApiProperty({
        enum: TaskPriority,
        example: TaskPriority.MEDIUM,
        description: 'Priority level',
        default: TaskPriority.MEDIUM
    })
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;


    @ApiPropertyOptional({
        example: '2023-06-15',
        description: 'Planned start date'
    })
    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @ApiPropertyOptional({
        example: '2023-06-30',
        description: 'Task deadline'
    })
    @Column({ type: 'date', nullable: true })
    dueDate: Date;

    @ApiPropertyOptional({
        example: 50,
        description: 'Completion percentage (0-100)',
        minimum: 0,
        maximum: 100
    })
    @Column({ type: 'smallint', default: 0 })
    completionPercentage: number;

    @ApiPropertyOptional({
        example: '2023-06-10T00:00:00.000Z',
        description: 'Actual completion time'
    })
    @Column({ nullable: true })
    completedAt: Date;


    @ApiPropertyOptional({
        type: () => ProjResource,
        description: 'Assigned resource'
    })
    @ManyToOne(() => ProjResource, { nullable: true })
    assignee: ProjResource;

    @ApiPropertyOptional({
        type: () => [ProjResource],
        description: 'Collaborators'
    })
    @ManyToMany(() => ProjResource)
    @JoinTable()
    collaborators: ProjResource[];

    /*@ApiPropertyOptional({ 
      type: () => [Tag], 
      description: 'Associated tags' 
    })
    @ManyToMany(() => Tag, (tag) => tag.tasks)
    @JoinTable()
    tags: Tag[];
  
    @ApiPropertyOptional({ 
      type: () => [Comment], 
      description: 'Task comments' 
    })
    @OneToMany(() => Comment, (comment) => comment.task)
    comments: Comment[];
  
    @ApiPropertyOptional({ 
      type: () => [Attachment], 
      description: 'Attached files' 
    })
    @OneToMany(() => Attachment, (attachment) => attachment.task)
    attachments: Attachment[];
  
   */

}