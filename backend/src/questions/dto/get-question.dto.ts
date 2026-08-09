import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../common/types/game.types';

export class GetRandomQuestionDto {
  @IsOptional()
  @IsEnum(['association', 'sequence', 'approximation', 'common'])
  category?: CategoryType;

  @IsOptional()
  @IsString()
  excludeId?: string;
}
