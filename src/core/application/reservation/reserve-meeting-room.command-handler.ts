import { Injectable, Inject } from '@nestjs/common';
import { ReserveMeetingRoomCommand } from './reserve-meeting-room.command';
import { ReservationRepository } from './reservation.repository';
import { Reservation } from '../../domain/reservation.entity';
import { MeetingRoomRepository } from '../meeting-room/meeting-room.repository';
import { HotDeskRepository } from '../hotdesk/hotdesk.repository';
import { HotDesk } from '../../domain/hotdesk.entity';

@Injectable()
export class ReserveMeetingRoomCommandHandler {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
    @Inject('MeetingRoomRepository')
    private readonly meetingRoomRepository: MeetingRoomRepository,
    @Inject('HotDeskRepository')
    private readonly hotDeskRepository: HotDeskRepository,
  ) {}

  execute(command: ReserveMeetingRoomCommand): Reservation {
    const { meetingRoomId, userId, date, hour, duration } = command;

    // Validaciones
    const meetingRoom = this.meetingRoomRepository.findByName(meetingRoomId);
    if (!meetingRoom) {
      throw new Error('404: Not Found - MeetingRoom does not exist');
    }

    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new Error('400: Bad Request - Invalid hour');
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 12) {
      throw new Error('400: Bad Request - Invalid duration');
    }

    // Verificar que no haya conflicto de reservas en la misma franja horaria
    const existingReservations =
      this.reservationRepository.findByMeetingRoomAndDate(meetingRoomId, date);
    for (const res of existingReservations) {
      const resStart = res.hour;
      const resEnd = res.hour + res.duration;
      const newResStart = hour;
      const newResEnd = hour + duration;

      if (newResStart < resEnd && newResEnd > resStart) {
        throw new Error(
          '409: Conflict - MeetingRoom is already reserved for this time slot',
        );
      }
    }

    // Crear la reserva
    const reservation = new Reservation(
      meetingRoomId,
      userId,
      date,
      hour,
      duration,
    );
    this.reservationRepository.save(reservation);

    // Asignar un HotDesk de cortesía si hay disponibilidad
    const availableHotDesk = this.hotDeskRepository.findByNumber(1);
    if (availableHotDesk) {
      this.hotDeskRepository.save(new HotDesk(availableHotDesk.number));
    }

    return reservation;
  }
}
