import { HotDesk } from './../../domain/hotdesk.entity';

export interface HotDeskRepository {
  findByNumber(number: number): HotDesk | undefined;
  save(hotdesk: HotDesk): void;
}
