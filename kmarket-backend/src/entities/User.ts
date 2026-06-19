import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("varchar", { unique: true })
    email: string;

    @Column("varchar")
    password: string;

    @Column("varchar", { nullable: true })
    avatar: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
