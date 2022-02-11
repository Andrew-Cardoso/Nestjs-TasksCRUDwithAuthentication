import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),

    /* We need the async method to load environment variables */
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: '0.0.0.0',
    //   port: 5789,
    //   username: 'postgres',
    //   password: 'zerotohero',
    //   database: 'task-management',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
