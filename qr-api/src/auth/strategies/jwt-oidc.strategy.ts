import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { JwtValidatePayloadDto } from '../dtos/jwt-validate.dto';

@Injectable()
export class JwtOIDCStrategy extends PassportStrategy(Strategy, 'jwt-oidc') {
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
        const requiredScope = 'openid';
        const scopes = payload.scope ? payload.scope.split(' ') : [];

        if (!scopes.includes(requiredScope))
            throw new UnauthorizedException(`Required scope '${requiredScope}' not found`);

        return { userId: payload.sub };
    }
}
