import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { GenerateTicketDto } from './dtos/generate-ticket.dto';
import { QrService } from 'src/qr/qr.service';
import { TicketsCountDto } from './dtos/tickets-count.dto';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketsRepository: Repository<Ticket>,
        private readonly qrService: QrService
    ) {}

    async getTicketsCount(): Promise<TicketsCountDto> {
        const [, ticketsCount] = await this.ticketsRepository.findAndCount();
        return { count: ticketsCount } as TicketsCountDto;
    }

    async getTicketByUuid(uuid: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOneBy({ uuid });
        if (!ticket) throw new BadRequestException('Ticket not found');
        return ticket;
    }

    async generateTicket(@Body() generateTicketDto: GenerateTicketDto): Promise<string> {
        const [, matchingTicketsCount] = await this.ticketsRepository.findAndCountBy({
            vatin: generateTicketDto.vatin,
        });

        if (matchingTicketsCount > 3) throw new BadRequestException('VATIN already has 3 tickets');

        const ticket = this.ticketsRepository.create({
            vatin: generateTicketDto.vatin,
            firstName: generateTicketDto.firstName,
            lastName: generateTicketDto.lastName,
        });

        const savedTicket = await this.ticketsRepository.save(ticket);

        const ticketUrl = `${process.env.FRONTEND_URL}/tickets/${savedTicket.uuid}`;

        return this.qrService.generateQrDataUrl(ticketUrl);
    }
}