import * as request from 'supertest'
import {Test} from '@nestjs/testing'
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {JwtAuthGuard} from "../../auth/jwt-auth.guard"
import {User} from "../../auth/user"
import {PasswordRepository} from "../../repository/passwordRepository.service"
import {passwordDto1, passwordDto2, passwordEntry1, passwordEntry2} from "./fixtures"
import {PasswordController} from "../passwordController"
import {PasswordService} from "../../service/password.service"
import {LoggerModule} from "nestjs-pino"
import {ObjectId} from "mongodb"

let app: INestApplication
const userEmail = "user@gmail.com"

const AuthGuardMock = {
    canActivate(ctx) {
        const request = ctx.switchToHttp().getRequest()
        request.user = new User(userEmail)
        return true
    }
} as JwtAuthGuard

const mockRepository = {
    findBy: () => [passwordEntry1(), passwordEntry2()],
    findById: () => passwordEntry1(),
    create: () => ObjectId.createFromHexString('5fe0b627db10b2cf6ebac31e'),
    update: () => passwordEntry1(),
    delete: () => true
}

beforeEach(async () => startApp(mockRepository))

const startApp = async (mockRepository) => {
    const moduleRef = await Test.createTestingModule({
        imports: [LoggerModule.forRoot()],
        controllers: [PasswordController],
        providers: [PasswordService, PasswordRepository],
    })
        .overrideGuard(JwtAuthGuard)
        .useValue(AuthGuardMock)
        .overrideProvider(PasswordRepository)
        .useValue(mockRepository)
        .compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    await app.init()
}

describe('/GET Passwords', () => {
    it(`when get passwords return 200`, () => {
        return request(app.getHttpServer())
            .get('/api/password')
            .expect(200)
            .expect([passwordDto1(), passwordDto2()])
    })

    it(`when get passwords with return 200`, () => {
        return request(app.getHttpServer())
            .get('/api/password?server=my_server&login=my_login')
            .expect(200)
            .expect([passwordDto1(), passwordDto2()])
    })
})

describe('/GET Password by ID', () => {
    it(`when get password by Id return 200`, () => {
        return request(app.getHttpServer())
            .get('/api/password/6311e9359490db305ec46e32')
            .expect(200)
            .expect(passwordDto1())
    })

    it(`when not found return 404`, async () => {
        const mockRepositoryWithNoUser = {
            findById: () => null,
        }
        await startApp(mockRepositoryWithNoUser)

        return request(app.getHttpServer())
            .get('/api/password/6311e9359490db305ec46e34')
            .expect(404)
    })
})

describe('/POST Password ', () => {
    it(`when post password return 200`, () => {
        return request(app.getHttpServer())
            .post('/api/password')
            .send({
                server: "my_server",
                login: "login_name",
                password: "my_password"
            })
            .expect(201)
    })

    it(`when post password and not complete body return 400`, () => {
        return request(app.getHttpServer())
            .post('/api/password')
            .send({
                login: "login_name",
                password: "my_password"
            })
            .expect(400)
    })
})

describe('/PUT Password ', () => {
    it(`when update password return 200`, () => {
        return request(app.getHttpServer())
            .put('/api/password/6311e9359490db305ec46e32')
            .send({
                server: "my_server",
                login: "login_name",
            })
            .expect(200)
    })

    it(`when update password and empty body return 400`, () => {
        return request(app.getHttpServer())
            .post('/api/password')
            .expect(400)
    })
})

describe('/DELETE Password ', () => {
    it(`when delete password return 200`, () => {
        return request(app.getHttpServer())
            .delete('/api/password/6311e9359490db305ec46e32')
            .expect(200)
    })
})

afterAll(async () => {
    await app.close()
})