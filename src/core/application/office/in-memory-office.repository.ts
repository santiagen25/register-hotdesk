import { Injectable } from '@nestjs/common';
import { OfficeRepository } from './office.repository';
import { Office } from '../../domain/office.entity';

@Injectable()
export class InMemoryOfficeRepository implements OfficeRepository {
  private offices: Office[] = [];

  findByNumber(number: number): Office | undefined {
    return this.offices.find((office) => office.number === number);
  }

  save(office: Office): void {
    this.offices.push(office);
  }
}
