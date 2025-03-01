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
import { RegisterMeetingRoomCommandHandler } from '../application/meeting-room/register-meeting-room.command-handler';
import { RegisterMeetingRoomCommand } from '../application/meeting-room/register-meeting-room.command';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(
    private readonly registerMeetingRoomHandler: RegisterMeetingRoomCommandHandler,
  ) {}

  @Post()
  register(@Body() body: { name: string; capacity: number }) {
    try {
      const command = new RegisterMeetingRoomCommand(body.name, body.capacity);
      return this.registerMeetingRoomHandler.execute(command);
    } catch (error) {
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('498')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        '500: Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
