import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { FortuneModule } from './fortune/fortune.module';
import { FindModule } from './find/find.module';
import { HistoryModule } from './history/history.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    MailModule,
    FortuneModule,
    FindModule,
    HistoryModule,
    UploadModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
