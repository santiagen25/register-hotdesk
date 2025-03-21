/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HotDeskRepository } from './hotdesk.repository';
import { HotDesk } from '../../domain/hotdesk.entity';

@Injectable()
export class InMemoryHotDeskRepository implements HotDeskRepository {
  private hotdesks: HotDesk[] = [];

  findByNumber(number: number): HotDesk | undefined {
    return this.hotdesks.find(hotdesk => hotdesk.number === number);
  }

  save(hotdesk: HotDesk): void {
    this.hotdesks.push(hotdesk);
  }
}
