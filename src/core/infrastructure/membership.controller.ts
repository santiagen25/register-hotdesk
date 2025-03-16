/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      if (!result) {
        throw new HttpException(
          '404: Not Found - Membership does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return { status: 'OK', membership: result };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
