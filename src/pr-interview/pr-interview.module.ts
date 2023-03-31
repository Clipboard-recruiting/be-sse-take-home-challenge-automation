import { Module } from '@nestjs/common';
import { InterviewService } from './pr-interview.service';
import { GithubCliModule } from '../github-cli/github-cli.module';
import { GithubApiModule } from '../github-api/github-api.module';

@Module({
  providers: [InterviewService],
  exports: [InterviewService],
  imports: [GithubCliModule, GithubApiModule],
})
export class PrInterviewModule {}
