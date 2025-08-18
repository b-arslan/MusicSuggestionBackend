import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RecommendDto } from './dto/recommend.dto';

const FALLBACK_IMAGE =
    'https://upload.wikimedia.org/wikipedia/commons/8/84/No_image_2.svg';

@Injectable()
export class RecommendService {
    constructor(private readonly configService: ConfigService) {}

    async getRecommendations({
        song,
        artist,
        mood,
        lessPopular,
    }: RecommendDto): Promise<any[]> {
        const songText = song?.length ? song.join(', ') : '';
        const artistText = artist?.length ? artist.join(', ') : '';

        const prompt = `
You are a music recommendation engine. Based on the following input, recommend 5 songs.

${songText ? `Songs: ${songText}` : ''}
${artistText ? `Artists: ${artistText}` : ''}
${mood ? `Mood: ${mood}` : ''}
Less Popular: ${lessPopular ? 'Yes' : 'No'}

Return the result as a valid JSON array with 10 items. Each item must be in this format:

{
  "song": "Song Title",
  "artist": "Artist Name"
}

Only return pure JSON, no explanations, no markdown.
`;

        // GPT'den JSON yanıt al
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
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

        const rawText = response.data.choices[0].message.content;

        let recommendations: { song: string; artist: string }[];

        try {
            recommendations = JSON.parse(rawText);
        } catch (err) {
            console.error('GPT yanıtı ayrıştırılamadı:', err);
            return [
                {
                    song: 'Unknown',
                    artist: 'Unknown',
                    coverImage: FALLBACK_IMAGE,
                },
            ];
        }

        // Deezer'dan kapak görsellerini al
        const enriched = await Promise.all(
            recommendations.map(async (item) => {
                const coverImage = await this.getCoverImage(
                    item.artist,
                    item.song,
                );
                return {
                    song: item.song,
                    artist: item.artist,
                    coverImage,
                };
            }),
        );

        return enriched;
    }

    private async getCoverImage(artist: string, song: string): Promise<string> {
        try {
            const response = await axios.get('https://api.deezer.com/search', {
                params: {
                    q: `artist:"${artist}" track:"${song}"`,
                },
            });

            return (
                response.data.data?.[0]?.album?.cover_medium || FALLBACK_IMAGE
            );
        } catch (err) {
            return FALLBACK_IMAGE;
        }
    }
}
