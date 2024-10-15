import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtValidatePayloadDto } from '../dtos/jwt-validate.dto';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtM2MStrategy extends PassportStrategy(Strategy, 'jwt-m2m') {
    constructor() {
        super({
            // Extraction of JWT from the Authorization header as a Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: process.env.AUTH0_ISSUER_BASE_URL + '/',
            audience: 'qr-api-example.com',
            algorithms: ['RS256'],
            // Retrieving public key from the JWKS endpoint
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
            }),
        });
    }

    async validate(payload: JwtValidatePayloadDto) {
        return { userId: payload.sub };
    }
}
