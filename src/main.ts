import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {NestExpressApplication} from '@nestjs/platform-express'
import {ValidationPipe} from '@nestjs/common'
import {json} from 'body-parser'
import {HttpExceptionFilter} from './exception/validation.exception.filter'
import helmet from 'helmet'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.use(json({limit: '5mb'}))
    app.use(helmet())
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    app.useGlobalFilters(new HttpExceptionFilter())

    await app.listen(process.env.PORT)
}

bootstrap()
