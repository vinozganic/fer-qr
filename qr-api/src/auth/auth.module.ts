import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtM2MStrategy } from './strategies/jwt-m2m.strategy';
import { JwtOIDCStrategy } from './strategies/jwt-oidc.strategy';

@Module({
    imports: [PassportModule],
    providers: [JwtM2MStrategy, JwtOIDCStrategy],
})
export class AuthModule {}
