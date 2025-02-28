import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { Reservation } from '../../domain/reservation.entity';

@Injectable()
export class InMemoryReservationRepository implements ReservationRepository {
  private reservations: Reservation[] = [];

  findByMeetingRoomAndDate(meetingRoomId: string, date: string): Reservation[] {
    return this.reservations.filter(
      (res) => res.meetingRoomId === meetingRoomId && res.date === date,
    );
  }

  save(reservation: Reservation): void {
    this.reservations.push(reservation);
  }
}
