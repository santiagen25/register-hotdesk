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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('400')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('409')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        '500: Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
