import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PineconeNamespaces } from '../../asset/entity/pinecone-namespace.entity';

@Entity()
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PineconeNamespaces)
  @JoinColumn({ name: 'namespace_id' })
  namespace: PineconeNamespaces;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text' })
  answer: string;

  @CreateDateColumn()
  createdAt: Date;
}
