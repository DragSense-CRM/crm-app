import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkspaceWithBlueprintEntity } from '../../entities/base-workspace.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('ws_entities')
export class DynamicEntity extends WorkspaceWithBlueprintEntity {

    @ApiProperty({ example: 1, description: 'Dynamic entity name' })
    @Column({ unique: true })
    name: string;

    @ApiPropertyOptional({ example: 'This is the description', description: 'Dynamic entity description' })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiPropertyOptional({
        description: 'List of relationships to validate',
        type: [Object],
        required: false,
    })
    @Column('jsonb', { nullable: true })
    relationships?: Record<string, any>[];
}
