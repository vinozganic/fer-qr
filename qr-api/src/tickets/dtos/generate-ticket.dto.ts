import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class GenerateTicketDto {
    @IsString()
    @IsNotEmpty()
    @Length(11, 11, { message: 'VATIN must be exactly 11 characters long' })
    @Matches(/^\d+$/, { message: 'VATIN must contain only numbers' })
    vatin: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}
