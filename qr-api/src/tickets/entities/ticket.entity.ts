import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNumberString, Length } from 'class-validator';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ length: 11, unique: true })
    @IsNumberString()
    @Length(11, 11, { message: 'VATIN must be exactly 11 numeric characters long' })
    vatin: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn()
    created: Date;
}
