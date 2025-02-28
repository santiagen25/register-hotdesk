import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReserveMeetingRoomCommandHandler } from '../application/reservation/reserve-meeting-room.command-handler';
import { ReserveMeetingRoomCommand } from '../application/reservation/reserve-meeting-room.command';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reserveMeetingRoomHandler: ReserveMeetingRoomCommandHandler,
  ) {}

  @Post()
  reserve(
    @Body()
    body: {
      meetingRoomId: string;
      userId: string;
      date: string;
      hour: number;
      duration: number;
    },
  ) {
    try {
      const command = new ReserveMeetingRoomCommand(
        body.meetingRoomId,
        body.userId,
        body.date,
        body.hour,
        body.duration,
      );
      return this.reserveMeetingRoomHandler.execute(command);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('400')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('404')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
