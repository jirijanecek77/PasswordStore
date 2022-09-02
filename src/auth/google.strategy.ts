import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {Strategy, VerifyCallback} from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URL,
            scope: ['email', 'profile'],
            prompt: 'select_account'
        })
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const {name, emails, photos} = profile;
        const user = {
            email: emails?.length ? emails[0].value : '',
            firstName: name?.givenName,
            lastName: name?.familyName,
            picture: photos?.length ? photos[0].value : '',
            accessToken
        }
        done(null, user)
    }
}