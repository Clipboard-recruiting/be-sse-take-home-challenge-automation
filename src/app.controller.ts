import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  CanActivate,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrInterviewService } from './pr-interview/pr-interview.service';

const API_PASSWORD = 'API_PASS';

class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    return authorization === API_PASSWORD;
  }
}

interface CreatePrInterviewPayload {
  username: string;
}

@Controller()
export class AppController {
  constructor(private readonly interviewService: PrInterviewService) {}

  @Get('health-check/public')
  async public(@Headers() headers) {
    return {
      headers,
      date: new Date(),
    };
  }

  @Get('health-check/private')
  @UseGuards(AuthGuard)
  async private(@Headers() headers) {
    return {
      headers,
      date: new Date(),
    };
  }

  @Get('be-sse-interviews')
  @UseGuards(AuthGuard)
  async getInterviews() {
    const interviewRepos = await this.interviewService.list();
    return {
      repos: interviewRepos,
    };
  }

  @Post('be-sse-interviews')
  @UseGuards(AuthGuard)
  async createInterview(
    @Body() createInterviewPayload: CreatePrInterviewPayload,
  ) {
    const { username } = createInterviewPayload;
    const createdInterviewRepo = await this.interviewService.create(
      username,
    );
    return {
      repo: createdInterviewRepo,
    };
  }

  @Delete('be-sse-interviews/:repoName')
  @UseGuards(AuthGuard)
  async deleteInterview(@Param('repoName') repoName: string) {
    const deletedInterviewRepo = await this.interviewService.delete(
      repoName,
    );
    return {
      repo: deletedInterviewRepo,
    };
  }
}
