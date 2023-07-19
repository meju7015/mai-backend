import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Assets } from '../../asset/entity/asset.entity';
import { User } from './user.entity';
import { ChatbotSetting } from '../../chatbot/entity/chatbot-setting.entity';

export enum ChatbotTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum ChatbotAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

@Entity()
export class UserChatbot {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @ManyToOne(() => User, (user) => user.userChatbots)
  user: User;

  @OneToOne(() => ChatbotSetting, (chatbotSetting) => chatbotSetting.chatbot)
  @JoinColumn({ name: 'setting_id' })
  setting: ChatbotSetting;

  @Column({ type: 'int', default: 0 })
  numberOfCharacters: number;

  @Column({ type: 'text', nullable: false })
  startMessage: string;

  @Column({ type: 'text', nullable: true })
  suggestedMessage: string;

  @Column({ type: 'varchar', length: 20, default: ChatbotTheme.LIGHT })
  theme: ChatbotTheme;

  @OneToOne(() => Assets, { nullable: true })
  @JoinColumn({ name: 'profile_picture_id' })
  profilePicture: Assets;

  @Column({ type: 'boolean', default: true })
  isShowProfile: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName: string;

  @Column({ type: 'varchar', length: 8, default: '#0075FF' })
  userMessageColor: string;

  @OneToOne(() => Assets, { nullable: true })
  @JoinColumn({ name: 'user_profile_picture_id' })
  userProfilePicture: Assets;

  @Column({ type: 'boolean', default: true })
  isShowUserProfile: boolean;

  @Column({ type: 'varchar', length: 10 })
  alignment: string;
}
