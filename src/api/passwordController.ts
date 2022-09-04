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
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger"
import {Query} from "@nestjs/common/decorators/http/route-params.decorator"
import {InjectPinoLogger, PinoLogger} from "nestjs-pino"

@Controller('api/password')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Password Controller')
export class PasswordController {
    constructor(
        @InjectPinoLogger(PasswordController.name) private readonly logger: PinoLogger,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService
    ) {
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'All passwords',
        type: PasswordDto,
        isArray: true
    })
    async searchPasswords(
        @Headers('Authorization') auth: string,
        @Query("server") serverSearch?: string,
        @Query("login") loginSearch?: string,
    ): Promise<PasswordDto[]> {
        const userId = this.extractUserId(auth)

        this.logger.info("User %s searches for passwords with server '%s' and login '%s'.", userId, serverSearch, loginSearch)
        const passwords = await this.passwordService.searchPassword(userId, serverSearch, loginSearch)
        this.logger.info("User %s found %d passwords.", userId, passwords.length)

        return passwords.map(e => PasswordDto.from(e))
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Password by id',
        type: PasswordDto,
        isArray: false
    })
    async getPasswordById(@Param('id') id: string, @Headers('Authorization') auth: string): Promise<PasswordDto> {
        const userId = this.extractUserId(auth)

        const passwordEntry = await this.passwordService.findById(id, userId)
        this.logger.info("User %s found password with id '%s'.", userId, id)
        return PasswordDto.from(passwordEntry)
    }

    @Post()
    async insertPassword(@Body() body: CreatePasswordDto, @Headers('Authorization') auth: string): Promise<void> {
        const userId = this.extractUserId(auth)

        const id = await this.passwordService.create(userId, body.server, body.login, body.password)
        this.logger.info("User %s inserted new password with id '%s'.", userId, id.toHexString())
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: 'Update password entry, at least one field is required',
        type: PasswordDto,
        isArray: false
    })
    async updatePassword(@Param('id') id: string, @Body() data: UpdatePasswordDto, @Headers('Authorization') auth: string): Promise<PasswordDto> {
        const userId = this.extractUserId(auth)
        const passwordEntry = await this.passwordService.update(id, userId, data)

        this.logger.info("User %s updated password with id '%s'.", userId, id)
        return PasswordDto.from(passwordEntry)
    }

    @Delete(':id')
    async deletePassword(@Param('id') id: string, @Headers('Authorization') auth: string): Promise<void> {
        const userId = this.extractUserId(auth)
        await this.passwordService.delete(id, userId)
        this.logger.info("User %s deleted password with id '%s'.", userId, id)
    }

    private extractUserId(auth: string): string {
        if (!auth) {
            throw new UnauthorizedException()
        }
        const userId = (this.jwtService.decode(auth.split(' ')[1]) as JwtPayload).email
        if (!userId) {
            throw new UnauthorizedException("No userId")
        }

        return userId
    }
}
