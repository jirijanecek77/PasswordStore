import {Controller, Get, Req, UseGuards} from "@nestjs/common"
import {AuthGuard} from "@nestjs/passport"
import {JwtService} from "@nestjs/jwt"
import {JwtPayload} from "./jwtPayload"
import {ApiTags} from "@nestjs/swagger"

@ApiTags('Google Auth Controller')
@Controller('google')
export class AuthController {
    constructor(private readonly jwtService: JwtService,) {
    }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        if (!req.user) {
            return 'No user from google'
        }

        const payload: JwtPayload = {email: req.user.email}
        const options = {expiresIn: process.env.SESSION_TIMEOUT_SEC + 's'}
        return this.jwtService.sign(payload, options)
    }
}