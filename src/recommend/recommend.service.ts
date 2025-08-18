import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RecommendDto } from './dto/recommend.dto';

@Injectable()
export class RecommendService {
    constructor(private readonly configService: ConfigService) {}

    async getRecommendations({
        song,
        artist,
        mood,
        lessPopular,
    }: RecommendDto): Promise<string> {
        const songText = song?.length ? song.join(', ') : '';
        const artistText = artist?.length ? artist.join(', ') : '';

        const prompt = `
I want you to act as a music recommendation engine.
Based on the following input, suggest 5 songs.

${songText ? `Songs: ${songText}` : ''}
${artistText ? `Artists: ${artistText}` : ''}
${mood ? `Mood: ${mood}` : ''}
Less Popular: ${lessPopular ? 'Yes' : 'No'}

Return the result as a numbered list.
`;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.data.choices[0].message.content;
    }
}
