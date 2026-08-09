import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CategoryType } from '../../common/types/game.types';

export class GenerateQuestionsDto {
  @IsOptional()
  @IsEnum(['association', 'sequence', 'approximation', 'common'])
  category?: CategoryType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  count?: number = 1;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  customApiKey?: string;
}
