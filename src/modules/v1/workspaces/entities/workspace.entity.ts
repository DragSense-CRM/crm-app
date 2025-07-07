import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { GeneralBaseEntity } from '@/base-entity/base.entity';


import { User } from '../../users/entities/user.entity';


@Entity('workspaces')
export class Workspace extends GeneralBaseEntity {
    @ApiProperty({ description: 'Name of the workspace' })
    @Column({ unique: true, type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({ description: 'Optional description of the workspace', required: false })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({ description: 'ID of the user who created the workspace' })
    @Column({ type: 'int' })
    @ManyToOne(() => User, (user) => user.workspaces, { nullable: false })
    createdBy: User;
}
