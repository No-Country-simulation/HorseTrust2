import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Sex, Discipline, VerificationStatus, HorseSaleStatus } from '../enums';
import { User } from './User';
import { Document } from './Document';
import { Sale } from './Sale';

@Entity('horses')
export class Horse {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne('User', 'owned_horses', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner!: User;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'int' })
    age!: number;

    @Column({ type: 'enum', enum: Sex })
    sex!: Sex;

    @Column({ type: 'varchar' })
    breed!: string;

    @Column({ type: 'enum', enum: Discipline })
    discipline!: Discipline;

    @Column({ type: 'integer', nullable: true })
    price?: number | null;

    @Column({ type: 'enum', enum: HorseSaleStatus, default: HorseSaleStatus.for_sale })
    sale_status!: HorseSaleStatus;

    @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.pending })
    verification_status!: VerificationStatus;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    // Relations
    @OneToMany('Document', 'horse', { cascade: true })
    documents!: Document[];

    @OneToMany('Sale', 'horse', { cascade: true })
    sales!: Sale[];
}
