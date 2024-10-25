import { BadRequestException, Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
    constructor() {}

    async generateQrBuffer(url: string): Promise<Buffer> {
        try {
            return await QRCode.toBuffer(url);
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new BadRequestException('Failed to generate QR code');
        }
    }
}
