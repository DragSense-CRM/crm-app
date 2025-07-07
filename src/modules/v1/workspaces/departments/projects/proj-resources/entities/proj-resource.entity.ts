import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectWithBlueprintEntity } from '../../entities/base-project.entity';
import { DepResource } from '../../../dep-resources/entities/dep-resource.entity';

@Entity('ws-proj-resources')
export class ProjResource extends ProjectWithBlueprintEntity {


    @ApiProperty({ example: 'Engineer', description: 'Project Resource name' })
    @Column({ type: 'varchar', length: 255 })
    name: string;


    @ManyToOne(() => DepResource, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resourceId' })
    @ApiProperty({ type: () => DepResource, description: 'Linked department resource' })
    depResource: DepResource;

    @Column({ nullable: true, default: 'Member' })
    @ApiProperty({ example: 'Manager', description: 'Designation or role in project' })
    role?: string;
}
