import {ConfigModule} from '@nestjs/config'
import {Module} from '@nestjs/common'
import {DbModule} from './db.module'
import {PasswordService} from './service/password.service'
import {PasswordController} from './api/passwordController'
import {PasswordRepository} from './repository/password-repository.service'
import {LoggerModule} from 'nestjs-pino'
import {req, res} from 'pino-std-serializers'
import {JwtStrategy} from "./auth/jwt.strategy"
import {PassportModule} from "@nestjs/passport"
import {JwtModule} from "@nestjs/jwt"
import {GoogleStrategy} from "./auth/google.strategy"
import {AuthController} from "./auth/authController"

@Module({
    imports: [
        DbModule.forRoot(process.env.DB_HOST as string),
        ConfigModule.forRoot(),
        LoggerModule.forRoot({
            pinoHttp: {
                formatters: {
                    level: (level) => ({level}),
                },
                level: process.env.LOG_LEVEL || 'trace',
                serializers: {
                    req: (r) => {
                        const {id, headers, ...result} = req(r)
                        return result
                    },
                    res: (r) => {
                        const {headers, ...result} = res(r)
                        return result
                    },
                },
                customLogLevel: (req, res, err) => {
                    if (res.statusCode >= 400 && res.statusCode < 500) {
                        return 'warn'
                    } else if (res.statusCode >= 500 || err) {
                        return 'error'
                    }
                    return 'info'
                },
                customSuccessMessage: (req, res) => {
                    if (res.statusCode === 404) {
                        return 'resource not found'
                    } else if (res.statusCode < 400) {
                        return 'request completed'
                    } else {
                        return 'request failed'
                    }
                },
                customErrorMessage: (req, res, error) => {
                    return 'request errored with status code: ' + res.statusCode
                },
                timestamp: true,
            },
        }),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: process.env.JWT_SECRET
        }),
    ],
    controllers: [AuthController, PasswordController],
    providers: [JwtStrategy, GoogleStrategy, PasswordService, PasswordRepository],
})
export class AppModule {
}
