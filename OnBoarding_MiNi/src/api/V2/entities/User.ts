import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { BaseEntity } from './baseEntity/base-entity';
import {SingleRun} from "./SingleRun";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar"})
    email!: string;

    @Column({ type: "varchar", length: 100 })
    password!: string;

    @Column({ type: "boolean", default: false })
    isAdmin!: boolean;

    @Column({ type: "varchar", length: 200, default: ""})
    refreshToken!: string;

    @OneToMany(() => SingleRun, singleRun => singleRun.user)
    singleRuns!: SingleRun[];

}