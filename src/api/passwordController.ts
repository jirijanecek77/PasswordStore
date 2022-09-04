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

@Controller('api/password')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Password Controller')
export class PasswordController {
    constructor(
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
        return (await this.passwordService.searchPassword(userId, serverSearch, loginSearch)).map(e => PasswordDto.from(e))
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

        return PasswordDto.from(await this.passwordService.findById(id, userId))
    }

    @Post()
    async insertPassword(@Body() body: CreatePasswordDto, @Headers('Authorization') auth: string): Promise<void> {
        const userId = this.extractUserId(auth)
        await this.passwordService.create(userId, body.server, body.login, body.password)
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
        return PasswordDto.from(await this.passwordService.update(id, userId, data))
    }

    @Delete(':id')
    async deletePassword(@Param('id') id: string, @Headers('Authorization') auth: string): Promise<void> {
        const userId = this.extractUserId(auth)
        await this.passwordService.delete(id, userId)
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
