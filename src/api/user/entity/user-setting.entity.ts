import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum Models {
  GPT_3_5_TURBO = 'gpt3-5-turbo',
  GPT_4 = 'gpt-4',
}

@Entity()
export class UserSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.userSetting)
  user: User;

  @Column({ type: 'varchar', length: 255 })
  projectName: string;

  @Column({ type: 'text' })
  basePrompt: string;

  @Column({ type: 'varchar', length: 50 })
  modelName: Models;

  @Column({ type: 'tinyint', default: 1 })
  temperature: number;

  @Column({ type: 'boolean', default: false })
  visibility: boolean;

  @Column({ type: 'text', nullable: true })
  domains?: string;
}