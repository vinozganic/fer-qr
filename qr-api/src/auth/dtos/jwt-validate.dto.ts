export class JwtValidatePayloadDto {
    aud: string | string[];
    azp: string;
    exp: number;
    iat: number;
    iss: string;
    sub: string;
    gty?: string;
    scope?: string;
}
