import {DynamicModule, Global, Module, OnApplicationShutdown, OnModuleInit,} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {ModuleRef} from '@nestjs/core'
import {MongoClient, MongoClientOptions} from 'mongodb'
import {MONGODB_CLIENT} from './constants'
import {InjectPinoLogger, PinoLogger} from "nestjs-pino"

@Global()
@Module({imports: [ConfigModule.forRoot()]})
export class DbModule implements OnModuleInit, OnApplicationShutdown {
    public static forRoot(
        uri: string,
        options: MongoClientOptions = {
            maxPoolSize: 1000,
            connectTimeoutMS: 5000,
        },
    ): DynamicModule {
        const connectionProvider = {
            provide: MONGODB_CLIENT,
            useFactory: async (): Promise<MongoClient> =>
                MongoClient.connect(uri, options),
        }
        return {
            module: DbModule,
            providers: [connectionProvider],
            exports: [connectionProvider],
        }
    }

    constructor(
        private readonly moduleRef: ModuleRef,
        @InjectPinoLogger(DbModule.name) private readonly logger: PinoLogger,
    ) {
        this.logger.info('Creating database connection...')
    }

    public async onApplicationShutdown() {
        this.logger.info('Closing connecting to database...')
        await this.moduleRef.get<MongoClient>(MONGODB_CLIENT).close()
        this.logger.info('Database connection closed.')
    }

    public onModuleInit(): any {
        this.logger.info('Connected to database.')
    }
}
