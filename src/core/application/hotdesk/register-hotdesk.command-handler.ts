import { Injectable, Inject } from '@nestjs/common';
import { RegisterHotDeskCommand } from './register-hotdesk.command';
import { HotDeskRepository } from './hotdesk.repository';
import { HotDesk } from '../../domain/hotdesk.entity';

@Injectable()
export class RegisterHotDeskCommandHandler {
  constructor(
    @Inject('HotDeskRepository') private readonly repository: HotDeskRepository,
  ) {}

  execute(command: RegisterHotDeskCommand): HotDesk {
    if (!Number.isInteger(command.number) || command.number <= 0) {
      throw new Error('400: Bad Request - Invalid number');
    }

    if (this.repository.findByNumber(command.number)) {
      throw new Error('498: Conflict - HotDesk number already exists');
    }

    const hotDesk = new HotDesk(command.number);
    this.repository.save(hotDesk);
    return hotDesk;
  }
}
