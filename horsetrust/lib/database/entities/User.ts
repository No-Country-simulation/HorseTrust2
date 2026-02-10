import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Role, SellerLevel } from '../enums';
import { Address } from './Address';
import { Horse } from './Horse';
import { Document } from './Document';
import { Chat } from './Chat';
import { Message } from './Message';
import { Sale } from './Sale';
import { Review } from './Review';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    avatar_url: string | null;

    @Column({ type: 'varchar', nullable: true })
    first_name: string | null;

    @Column({ type: 'varchar', nullable: true })
    last_name: string | null;

    @Column({ type: 'varchar', nullable: true })
    phone: string | null;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @Column({ type: 'enum', enum: SellerLevel, default: SellerLevel.bronze })
    seller_level: SellerLevel;

    @Column({ type: 'int', default: 0 })
    total_sales: number;

    @Column({ type: 'float', nullable: true })
    average_rating: number | null;

    @Column({ type: 'int', default: 0 })
    total_reviews: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    addresses: Address[];

    @OneToMany(() => Horse, (horse) => horse.owner, { cascade: true })
    owned_horses: Horse[];

    @OneToMany(() => Document, (document) => document.user, { cascade: true })
    documents: Document[];

    @OneToMany(() => Chat, (chat) => chat.buyer, { cascade: true })
    initiated_chats: Chat[];

    @OneToMany(() => Chat, (chat) => chat.seller, { cascade: true })
    seller_chats: Chat[];

    @OneToMany(() => Message, (message) => message.sender, { cascade: true })
    sent_messages: Message[];

    @OneToMany(() => Sale, (sale) => sale.seller, { cascade: true })
    sales_sold: Sale[];

    @OneToMany(() => Sale, (sale) => sale.buyer, { cascade: true })
    sales_purchased: Sale[];

    @OneToMany(() => Review, (review) => review.seller, { cascade: true })
    reviews_received: Review[];

    @OneToMany(() => Review, (review) => review.buyer, { cascade: true })
    reviews_given: Review[];
}
