import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceWithBlueprintEntity } from '../../entities/base-workspace.entity';
import { Project } from '../../departments/projects/entities/project.entity';

@Entity('ws-apps')
export class App extends WorkspaceWithBlueprintEntity {

    @ApiProperty({ example: 'CRM App' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiPropertyOptional({ example: 'CRM for managing customer leads' })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToMany(() => Project, project => project.app)
    @JoinTable()
    projects: Project[];

}
