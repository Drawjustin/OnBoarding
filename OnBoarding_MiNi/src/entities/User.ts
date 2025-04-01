import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { BaseEntity } from './baseEntity/base-entity';
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar", length: 100 })
    password!: string;

    @Column({ type: "boolean",default: false })
    isAdmin!: boolean;


}