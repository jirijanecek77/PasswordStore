import * as request from 'supertest'
import {Test} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import {JwtAuthGuard} from "../../auth/jwt-auth.guard"
import {User} from "../../auth/user"
import {PasswordRepository} from "../../repository/passwordRepository.service"
import {passwordEntry1} from "./fixtures"
import {PasswordController} from "../passwordController"
import {PasswordService} from "../../service/password.service"
import {LoggerModule} from "nestjs-pino"

let app: INestApplication
const userEmail = "user2@gmail.com"

const InvalidAuthGuardMock = {
    canActivate(ctx) {
        const request = ctx.switchToHttp().getRequest()
        request.user = new User(userEmail)
        return false
    }
} as JwtAuthGuard

const MissingUserAuthGuardMock = {
    canActivate(ctx) {
        return true
    }
} as JwtAuthGuard

const mockRepository = {
    findById: () => passwordEntry1(),
}

describe('Authorization test', () => {
    it(`when not authorized return 403`, async () => {
        app = (await getModuleRef(InvalidAuthGuardMock)).createNestApplication()
        await app.init()

        return request(app.getHttpServer())
            .get('/api/password/6311e9359490db305ec46e32')
            .expect(403)
    })

    it(`when missing user return 401`, async () => {
        app = (await getModuleRef(MissingUserAuthGuardMock)).createNestApplication()
        await app.init()

        return request(app.getHttpServer())
            .get('/api/password/6311e9359490db305ec46e32')
            .expect(401)
    })
})

afterAll(async () => {
    await app.close()
})

const getModuleRef = async (guard: JwtAuthGuard) => await Test.createTestingModule({
    imports: [LoggerModule.forRoot()],
    controllers: [PasswordController],
    providers: [PasswordService, PasswordRepository],
})
    .overrideGuard(JwtAuthGuard)
    .useValue(guard)
    .overrideProvider(PasswordRepository)
    .useValue(mockRepository)
    .compile()
