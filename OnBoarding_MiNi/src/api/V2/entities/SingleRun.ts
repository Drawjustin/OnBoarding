import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { BaseEntity } from './baseEntity/base-entity';
import {User} from "./User";
@Entity()
export class SingleRun extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "double" })
    totalDistance!: number;

    @Column({ type: "double" })
    totalTime!: number;

    @Column({ type: "double" })
    averagePace!: number;

    @Column({ type: "double" })
    averageHeart!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' }) // 외래
    user!: User;

    @Column({ type: "double" })
    userId!: number;
}