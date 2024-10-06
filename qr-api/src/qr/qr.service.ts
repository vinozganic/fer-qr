import { BadRequestException, Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
    constructor() {}

    async generateQrDataUrl(url: string): Promise<string> {
        try {
            return await QRCode.toDataURL(url);
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new BadRequestException('Failed to generate QR code');
        }
    }
}
