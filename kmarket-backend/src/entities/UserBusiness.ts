import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("user_businesses")
export class UserBusiness {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    userId: number;

    @Column("int")
    businessId: number;

    @Column("varchar", { default: "owner" })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
}
