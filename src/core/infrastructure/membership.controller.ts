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
import { RegisterPackageCommandHandler } from '../application/membership/register-package.command-handler';
import { RegisterPackageCommand } from '../application/membership/register-package.command';

@Controller('membership')
export class MembershipController {
  constructor(
    @Inject(RegisterPackageCommandHandler)
    private readonly registerPackageHandler: RegisterPackageCommandHandler,
  ) {}

  @Post('/package')
  registerPackage(
    @Body()
    body: {
      membershipId: string;
      credits: number;
      year: number;
      month: number;
    },
  ) {
    try {
      const packageInstance = this.registerPackageHandler.execute(
        new RegisterPackageCommand(
          body.membershipId,
          body.credits,
          body.year,
          body.month,
        ),
      );
      return { status: 'Created', package: packageInstance };
    } catch (error) {
      if (error.message.includes('400')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('404')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
