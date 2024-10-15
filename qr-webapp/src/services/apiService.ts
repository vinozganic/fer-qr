import axios from 'axios';
import { getM2MAccessToken } from './tokenService';
import { TicketDto } from '../dtos/ticketDto';
import { handleApiError } from '../utils/handleApiError';

export const getTicketCount = async (): Promise<number> => {
    try {
        const response = await axios.get(`${process.env.API_SERVICE_URL}/tickets`);
        return response.data.count;
    } catch (error) {
        handleApiError(error);
    }
};

export const generateTicket = async (vatin: string, firstName: string, lastName: string): Promise<string> => {
    const token = await getM2MAccessToken();
    try {
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
    } catch (error) {
        handleApiError(error);
    }
};

export const getTicketByUuid = async (uuid: string, accessToken?: string): Promise<TicketDto> => {
    try {
        const headers: any = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await axios.get(`${process.env.API_SERVICE_URL}/tickets/${uuid}`, { headers });
        return response.data as TicketDto;
    } catch (error) {
        handleApiError(error);
    }
};
