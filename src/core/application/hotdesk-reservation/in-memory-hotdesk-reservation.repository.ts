import { Injectable } from '@nestjs/common';
import { HotDeskReservationRepository } from './hotdesk-reservation.repository';
import { HotDeskReservation } from '../../domain/hotdesk-reservation.entity';

@Injectable()
export class InMemoryHotDeskReservationRepository
  implements HotDeskReservationRepository
{
  private reservations: HotDeskReservation[] = [];

  findByUserAndDate(
    userId: string,
    date: string,
  ): HotDeskReservation | undefined {
    return this.reservations.find(
      (res) => res.userId === userId && res.date === date,
    );
  }

  save(reservation: HotDeskReservation): void {
    this.reservations.push(reservation);
  }
}
