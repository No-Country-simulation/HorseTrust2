import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne('User', 'addresses', {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar' })
    country!: string;

    @Column({ type: 'varchar', nullable: true })
    province?: string | null;

    @Column({ type: 'varchar' })
    city!: string;

    @Column({ type: 'varchar' })
    street!: string;

    @Column({ type: 'varchar', nullable: true })
    postal_code?: string | null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
