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
import { RegisterOfficeCommandHandler } from '../application/office/register-office.command-handler';
import { RegisterOfficeCommand } from '../application/office/register-office.command';

@Controller('office')
export class OfficeController {
  constructor(
    private readonly registerOfficeHandler: RegisterOfficeCommandHandler,
  ) {}

  @Post()
  register(
    @Body() body: { number: number; leasePeriod?: number; status?: string },
  ) {
    try {
      const command = new RegisterOfficeCommand(
        body.number,
        body.leasePeriod,
        body.status,
      );
      return this.registerOfficeHandler.execute(command);
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
