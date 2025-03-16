/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateMembershipCommandHandler } from '../application/membership/create-membership.command-handler';
import { CreateMembershipCommand } from '../application/membership/create-membership.command';

@Controller('membership')
export class MembershipController {
  constructor(
    @Inject(CreateMembershipCommandHandler)
    private readonly commandHandler: CreateMembershipCommandHandler,
  ) {}

  @Post()
  createMembership(@Body() body: { userId: string }) {
    try {
      const membership = this.commandHandler.execute(
        new CreateMembershipCommand(body.userId),
      );
      return { status: 'Created', membership };
    } catch (error) {
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('409')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
