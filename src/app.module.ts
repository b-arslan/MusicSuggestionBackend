import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecommendModule } from './recommend/recommend.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), RecommendModule],
})
export class AppModule {}
