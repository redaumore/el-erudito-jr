import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [ConfigModule, QuestionsModule],
  controllers: [GeneratorController],
  providers: [GeneratorService],
  exports: [GeneratorService],
})
export class GeneratorModule {}
