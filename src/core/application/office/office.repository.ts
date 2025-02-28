import { Office } from '../../domain/office.entity';

export interface OfficeRepository {
  findByNumber(number: number): Office | undefined;
  save(office: Office): void;
}
