import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSetting } from './user-setting.entity';
import { UserChatbot } from './user-chatbot.entity';

export interface IUser {
  id: number;
  thirdPartyId: string;
  provider: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserSetting)
  @JoinColumn({ name: 'user_setting_id' })
  userSetting: UserSetting;

  @OneToOne(() => UserChatbot)
  @JoinColumn({ name: 'user_chatbot_id' })
  userChatbot: UserChatbot;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  thirdPartyId: string;

  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
