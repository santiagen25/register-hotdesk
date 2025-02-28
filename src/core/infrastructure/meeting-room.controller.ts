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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('400')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error.message.includes('498')) {
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
