import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Horse } from './Horse';
import { User } from './User';
import { Review } from './Review';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne('Horse', 'sales', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'horse_id' })
    horse!: Horse;

    @Column({ type: 'uuid', name: 'horse_id' })
    horse_id!: string;

    @ManyToOne('User', 'sales_sold', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'seller_id' })
    seller!: User;

    @Column({ type: 'uuid', name: 'seller_id' })
    seller_id!: string;

    @ManyToOne('User', 'sales_purchased', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buyer_id' })
    buyer!: User;

    @Column({ type: 'uuid', name: 'buyer_id' })
    buyer_id!: string;

    @Column({ type: 'integer' })
    price!: number;

    @Column({ type: 'timestamp' })
    completed_at!: Date;

    @CreateDateColumn()
    created_at!: Date;

    // Relations
    @OneToMany('Review', 'sale', { cascade: true })
    reviews!: Review[];
}
