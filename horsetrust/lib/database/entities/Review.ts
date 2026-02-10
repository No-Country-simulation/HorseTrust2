import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Sale } from './Sale';
import { User } from './User';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sale, (sale) => sale.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ type: 'uuid', name: 'sale_id' })
    sale_id: string;

    @ManyToOne(() => User, (user) => user.reviews_received, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'seller_id' })
    seller: User;

    @Column({ type: 'uuid', name: 'seller_id' })
    seller_id: string;

    @ManyToOne(() => User, (user) => user.reviews_given, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer: User;

    @Column({ type: 'uuid', name: 'buyer_id' })
    buyer_id: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string | null;

    @CreateDateColumn()
    created_at: Date;
}
