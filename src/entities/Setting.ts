import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("settings")
export class Setting {
    @PrimaryColumn("varchar")
    key: string;

    @Column("varchar")
    value: string;
}
