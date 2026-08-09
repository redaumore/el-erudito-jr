import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';
import { PairItem } from '../../common/types/game.types';

export class EvaluateAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  // For sequence
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userOrder?: string[];

  // For association
  @IsOptional()
  @IsArray()
  userPairs?: PairItem[];

  // For approximation
  @IsOptional()
  @IsNumber()
  userValue?: number;

  // For common
  @IsOptional()
  @IsString()
  userAnswer?: string;
}
