import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chat_id' })
    chat: Chat;

    @Column({ type: 'uuid', name: 'chat_id' })
    chat_id: string;

    @ManyToOne(() => User, (user) => user.sent_messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column({ type: 'uuid', name: 'sender_id' })
    sender_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'timestamp', nullable: true })
    read_at: Date | null;

    @CreateDateColumn()
    created_at: Date;
}
