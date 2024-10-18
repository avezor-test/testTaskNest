import { Controller, Post, Body, Query, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CheckUserMatch } from 'decorators/checkUserMatch.decorator';
import {
  ApiGetUserResults,
  ApiCheckAndSaveResult,
} from 'decorators/api/user.decorators';
import { ApiTags } from '@nestjs/swagger';
import { DeadTokenGuard } from 'src/auth/jwt/dead-token.guard';
import { CheckResultDto } from './dto/check-result.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, DeadTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('result-check')
  @ApiCheckAndSaveResult()
  async checkAndSaveResult(
    @Body('email') email: string,
    @Body('country') country: string,
    @Body('city') city: string,
    @CheckUserMatch() _: void,
  ): Promise<CheckResultDto> {
    return this.userService.checkAndSaveResult(email, country, city);
  }

  @Get('results-show')
  @ApiGetUserResults()
  async getUserResults(
    @Query('email') email: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CheckUserMatch() _: void,
    @Query('filterBy') filterBy?: string,
    @Query('filterValue') filterValue?: string,
  ): Promise<{ results: any[]; totalCount: number }> {
    return this.userService.getUserResults(
      email,
      page,
      limit,
      filterBy,
      filterValue,
    );
  }
}
