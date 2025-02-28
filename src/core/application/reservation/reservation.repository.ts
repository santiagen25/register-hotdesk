import { Reservation } from '../../domain/reservation.entity';

export interface ReservationRepository {
  findByMeetingRoomAndDate(meetingRoomId: string, date: string): Reservation[];
  save(reservation: Reservation): void;
}
