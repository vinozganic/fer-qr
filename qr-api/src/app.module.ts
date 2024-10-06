import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Ticket } from './tickets/entities/ticket.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TicketsModule } from './tickets/tickets.module';
import { QrModule } from './qr/qr.module';
import { AuthModule } from './auth/auth.module';

const DatabaseConfiguration = async (): Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Ticket],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
    };
};

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: DatabaseConfiguration,
        }),
        TicketsModule,
        QrModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
