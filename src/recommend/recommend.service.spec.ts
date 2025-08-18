import { Test, TestingModule } from '@nestjs/testing';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { RecommendDto } from './dto/recommend.dto';

describe('RecommendController', () => {
    let controller: RecommendController;
    let service: RecommendService;

    const mockService = {
        getRecommendations: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecommendController],
            providers: [
                {
                    provide: RecommendService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<RecommendController>(RecommendController);
        service = module.get<RecommendService>(RecommendService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return recommendations', async () => {
        const dto: RecommendDto = {
            song: ['Believer'],
            lessPopular: true,
        };

        mockService.getRecommendations.mockResolvedValue(
            '1. Believer\n2. Thunder',
        );

        const response = await controller.recommend(dto);

        expect(service.getRecommendations).toHaveBeenCalledWith(dto);
        expect(response).toEqual({
            success: true,
            recommendations: '1. Believer\n2. Thunder',
        });
    });
});
