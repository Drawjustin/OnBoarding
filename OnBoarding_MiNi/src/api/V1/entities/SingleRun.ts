import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { BaseEntity } from './baseEntity/base-entity';
import {User} from "./User";
@Entity()
export class SingleRun extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", default: 0 })
    totalDistance!: number;

    @Column({ type: "int", default: 0 })
    totalTime!: number;

    @Column({ type: "int", default: 0 })
    averagePace!: number;

    @Column({ type: "int", default: 0 })
    averageHeart!: number;

    @ManyToOne(() => User)
    user!: User;


}