import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {NestExpressApplication} from '@nestjs/platform-express'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import {ValidationPipe} from '@nestjs/common'
import {json} from 'body-parser'
import {HttpExceptionFilter} from './exception/validation.exception.filter'
import helmet from 'helmet'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {logger: false})
    app.use(json({limit: '5mb'}))
    app.use(helmet())
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({transform: true}))
    app.useGlobalFilters(new HttpExceptionFilter())

    const config = new DocumentBuilder()
        .setTitle('Password store')
        .setDescription('The password store API description')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(process.env.PORT)
}

bootstrap()
