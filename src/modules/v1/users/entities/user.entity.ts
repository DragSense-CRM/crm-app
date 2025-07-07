import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { GeneralBaseEntity } from '@/base-entity/base.entity';


import { Profile } from '../profiles/entities/profile.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';


@Entity('users')
export class User extends GeneralBaseEntity {

  @ApiProperty({
    example: 'email@example.com',
    description: 'The email address of the user',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @ApiHideProperty()
  @ApiProperty({ example: 'secrete', description: "user's password" })
  @Column({ type: 'varchar', length: 100, select: false })
  password: string;


  // Relations
  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Workspace, (workspace) => workspace.createdBy)
  workspaces: Workspace[];
}
