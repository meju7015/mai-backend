import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @OneToMany(() => UserChatbot, (userChatbot) => userChatbot.user)
  userChatbots: UserChatbot[];

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
