import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common'
import {PasswordService} from '../service/password.service'
import {CreatePasswordDto} from "./createPasswordDto"
import {JwtAuthGuard} from "../auth/jwt-auth.guard"
import {JwtService} from "@nestjs/jwt"
import {JwtPayload} from "../auth/jwtPayload"
import {PasswordDto} from "./passwordDto"
import {UpdatePasswordDto} from "./updatePasswordDto"

@Controller('api/password')
@UseGuards(JwtAuthGuard)
export class PasswordController {
    constructor(
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService
    ) {
    }

    @Get()
    async getPasswords(@Headers('Authorization') auth: string) {
        const userId = this.extractUserId(auth)
        return (await this.passwordService.findAll(userId)).map(e => PasswordDto.from(e))
    }

    @Get(':id')
    async getPasswordById(@Param('id') id: string, @Headers('Authorization') auth: string) {
        const userId = this.extractUserId(auth)

        return PasswordDto.from(await this.passwordService.findById(id, userId))
    }

    @Post()
    async insertPassword(@Body() body: CreatePasswordDto, @Headers('Authorization') auth: string) {
        const userId = this.extractUserId(auth)
        await this.passwordService.create(userId, body.server, body.login, body.password)
    }

    @Put(':id')
    async updatePassword(@Param('id') id: string, @Body() data: UpdatePasswordDto, @Headers('Authorization') auth: string) {
        const userId = this.extractUserId(auth)
        return PasswordDto.from(await this.passwordService.update(id, userId, data))
    }

    @Delete(':id')
    async deletePassword(@Param('id') id: string, @Headers('Authorization') auth: string) {
        const userId = this.extractUserId(auth)
        await this.passwordService.delete(id, userId)
    }

    private extractUserId(auth: string): string {
        const userId = (this.jwtService.decode(auth.split(' ')[1]) as JwtPayload).email
        if (!userId) {
            throw new UnauthorizedException("No userId")
        }

        return userId
    }
}
