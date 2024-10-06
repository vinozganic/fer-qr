import { IsNotEmpty, IsNumber } from 'class-validator';

export class TicketsCountDto {
    @IsNumber()
    @IsNotEmpty()
    count: number;
}
