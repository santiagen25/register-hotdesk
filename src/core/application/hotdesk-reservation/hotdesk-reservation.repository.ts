import { HotDeskReservation } from '../../domain/hotdesk-reservation.entity';

export interface HotDeskReservationRepository {
  findByUserAndDate(
    userId: string,
    date: string,
  ): HotDeskReservation | undefined;
  save(reservation: HotDeskReservation): void;
}
