import axios from 'axios';
import { getM2MAccessToken } from './tokenService';
import { TicketDto } from '../dtos/ticketDto';

export const getTicketCount = async (): Promise<number> => {
    const response = await axios.get(`${process.env.API_SERVICE_URL}/tickets`);
    return response.data.count;
};

export const generateTicket = async (vatin: string, firstName: string, lastName: string): Promise<string> => {
    const token = await getM2MAccessToken();
    const response = await axios.post(
        `${process.env.API_SERVICE_URL}/tickets/generate`,
        {
            vatin,
            firstName,
            lastName,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const getTicketByUuid = async (uuid: string): Promise<TicketDto> => {
    const response = await axios.get(`${process.env.API_SERVICE_URL}/tickets/${uuid}`);
    return response.data as TicketDto;
};
