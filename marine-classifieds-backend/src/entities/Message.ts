import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from './User';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.sentMessages, { eager: true })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { eager: true })
  receiver: User;

  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
} 