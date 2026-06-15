import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("sales")
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { nullable: true })
    clientId: number | null; // null represents a walk-in/unregistered customer

    @Column("decimal", { precision: 10, scale: 2 })
    totalAmount: number;

    @Column("varchar", { default: "completed" })
    status: string;

    @Column("varchar", { default: "cash" })
    paymentMethod: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
