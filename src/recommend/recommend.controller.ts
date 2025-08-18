import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { RecommendDto } from './dto/recommend.dto';

@Controller('api/v1/recommend')
export class RecommendController {
    constructor(private readonly recommendService: RecommendService) {}

    @Post()
    async recommend(@Body() body: RecommendDto) {
        const { song, artist, mood } = body;

        if (!song && !artist && !mood) {
            throw new BadRequestException('En az bir alan girilmelidir.');
        }

        const recommendations =
            await this.recommendService.getRecommendations(body);
        return { success: true, recommendations };
    }
}
