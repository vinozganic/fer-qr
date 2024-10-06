import { Module } from '@nestjs/common';
import { QrService } from 'src/qr/qr.service';

@Module({
    imports: [],
    controllers: [],
    providers: [QrService],
    exports: [QrService],
})
export class QrModule {}
