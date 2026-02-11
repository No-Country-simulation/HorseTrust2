import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne('User', 'initiated_chats', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer!: User;

    @Column({ type: 'uuid', name: 'buyer_id' })
    buyer_id!: string;

    @ManyToOne('User', 'seller_chats', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'seller_id' })
    seller!: User;

    @Column({ type: 'uuid', name: 'seller_id' })
    seller_id!: string;

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    // Relations
    @OneToMany('Message', 'chat', { cascade: true })
    messages!: Message[];
}
