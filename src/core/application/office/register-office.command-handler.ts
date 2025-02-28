import { Injectable, Inject } from '@nestjs/common';
import { RegisterOfficeCommand } from './register-office.command';
import { OfficeRepository } from './office.repository';
import { Office } from '../../domain/office.entity';

@Injectable()
export class RegisterOfficeCommandHandler {
  constructor(
    @Inject('OfficeRepository') private readonly repository: OfficeRepository,
  ) {}

  execute(command: RegisterOfficeCommand): Office {
    if (!Number.isInteger(command.number) || command.number <= 0) {
      throw new Error('400: Bad Request - Invalid number');
    }

    if (
      command.leasePeriod !== undefined &&
      (!Number.isInteger(command.leasePeriod) || command.leasePeriod <= 0)
    ) {
      throw new Error('400: Bad Request - Invalid leasePeriod');
    }

    if (this.repository.findByNumber(command.number)) {
      throw new Error('498: Conflict - Office number already exists');
    }

    const office = new Office(
      command.number,
      command.leasePeriod,
      command.status,
    );
    this.repository.save(office);
    return office;
  }
}
