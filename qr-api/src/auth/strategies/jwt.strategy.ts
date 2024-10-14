import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtValidateDto } from '../dtos/jwt-validate.dto';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // Extraction of JWT from the Authorization header as a Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: 'https://dev-qbh64wkf7i0r34c6.us.auth0.com/',
            audience: 'qr-api-example.com',
            algorithms: ['RS256'],
            // Retrieving public key from the JWKS endpoint
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                jwksUri: 'https://dev-qbh64wkf7i0r34c6.us.auth0.com/.well-known/jwks.json',
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
            }),
        });
    }

    async validate(payload: JwtValidateDto) {
        return { userId: payload.sub };
    }
}
