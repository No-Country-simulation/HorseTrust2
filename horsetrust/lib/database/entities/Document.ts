import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { TypeDocument, Category, DocumentPurpose, ExamType, ExamResult } from '../enums';
import { User } from './User';
import { Horse } from './Horse';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne('User', 'documents', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'uuid', name: 'user_id' })
    user_id!: string;

    @ManyToOne('Horse', 'documents', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'horse_id' })
    horse!: Horse;

    @Column({ type: 'uuid', name: 'horse_id' })
    horse_id!: string;

    @Column({ type: 'enum', enum: TypeDocument })
    type!: TypeDocument;

    @Column({ type: 'enum', enum: Category })
    category!: Category;

    @Column({ type: 'enum', enum: DocumentPurpose })
    purpose!: DocumentPurpose;

    @Column({ type: 'varchar' })
    url!: string;

    @Column({ type: 'varchar' })
    public_id!: string;

    @Column({ type: 'timestamp', nullable: true })
    issued_at?: Date | null;

    @Column({ type: 'varchar', nullable: true })
    vet_name?: string | null;

    @Column({ type: 'enum', enum: ExamType, nullable: true })
    exam_type?: ExamType | null;

    @Column({ type: 'enum', enum: ExamResult, nullable: true })
    exam_result?: ExamResult | null;

    @Column({ type: 'boolean', default: false })
    verified!: boolean;

    @Column({ type: 'varchar', nullable: true })
    reason?: string | null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
