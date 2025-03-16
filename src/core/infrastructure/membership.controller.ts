/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { GetMembershipSummaryQueryHandler } from '../application/membership/get-membership-summary.query-handler';
import { GetMembershipSummaryQuery } from '../application/membership/get-membership-summary.query';

@Controller('membership')
export class MembershipController {
  constructor(
    @Inject(GetMembershipSummaryQueryHandler)
    private readonly queryHandler: GetMembershipSummaryQueryHandler,
  ) {}

  @Get('/summary')
  getMembershipSummary(@Query('userId') userId: string) {
    try {
      const result = this.queryHandler.execute(
        new GetMembershipSummaryQuery(userId),
      );
      return { status: 'OK', membership: result };
    } catch (error) {
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('404')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
