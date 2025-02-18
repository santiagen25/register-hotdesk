import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RegisterHotDeskCommandHandler } from '../application/hotdesk/register-hotdesk.command-handler';
import { RegisterHotDeskCommand } from '../application/hotdesk/register-hotdesk.command';

@Controller('hotdesk')
export class HotDeskController {
  constructor(
    private readonly registerHotDeskHandler: RegisterHotDeskCommandHandler,
  ) {}

  @Post()
  register(@Body() body: { number: number }) {
    try {
      const command = new RegisterHotDeskCommand(body.number);
      return this.registerHotDeskHandler.execute(command);
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
