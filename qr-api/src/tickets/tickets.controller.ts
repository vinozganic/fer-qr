import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { GenerateTicketDto } from './dtos/generate-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Get()
    async getTicketsCount() {
        return this.ticketsService.getTicketsCount();
    }

    @UseGuards(AuthGuard('jwt-oidc'))
    @Get(':uuid')
    async getTicketByUuid(@Param('uuid') uuid: string) {
        return this.ticketsService.getTicketByUuid(uuid);
    }

    @UseGuards(AuthGuard('jwt-m2m'))
    @Post('generate')
    @UsePipes(new ValidationPipe({ transform: true }))
    async generateTicket(@Body() generateTicketDto: GenerateTicketDto) {
        return this.ticketsService.generateTicket(generateTicketDto);
    }
}
