import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    ValidateIf,
    ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendDto {
    @ValidateIf((o) => !o.artist && !o.mood)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @Type(() => String)
    song?: string[];

    @ValidateIf((o) => !o.song && !o.mood)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @Type(() => String)
    artist?: string[];

    @ValidateIf((o) => !o.song && !o.artist)
    @IsOptional()
    @IsString()
    mood?: string;

    @IsBoolean()
    lessPopular: boolean;
}
