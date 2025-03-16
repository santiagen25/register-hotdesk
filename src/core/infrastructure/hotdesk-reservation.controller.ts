/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReserveHotDeskCommandHandler } from '../application/hotdesk-reservation/reserve-hotdesk.command-handler';
import { ReserveHotDeskCommand } from '../application/hotdesk-reservation/reserve-hotdesk.command';

@Controller('hotdesk-reservation')
export class HotDeskReservationController {
  constructor(
    private readonly reserveHotDeskHandler: ReserveHotDeskCommandHandler,
  ) {}

  @Post()
  reserve(@Body() body: { userId: string; date: string }) {
    try {
      const command = new ReserveHotDeskCommand(body.userId, body.date);
      return this.reserveHotDeskHandler.execute(command);
    } catch (error) {
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('409')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        '500: Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
