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
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('404')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
