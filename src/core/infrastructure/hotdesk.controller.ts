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
