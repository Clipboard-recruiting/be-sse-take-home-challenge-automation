import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './pr-interview.service';

describe('PrInterviewService', () => {
  let service: InterviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterviewService],
    }).compile();

    service = module.get<InterviewService>(InterviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
