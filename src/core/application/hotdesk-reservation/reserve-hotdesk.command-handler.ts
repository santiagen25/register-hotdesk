import { Injectable, Inject } from '@nestjs/common';
import { ReserveHotDeskCommand } from './reserve-hotdesk.command';
import { HotDeskReservationRepository } from './hotdesk-reservation.repository';
import { HotDeskReservation } from '../../domain/hotdesk-reservation.entity';
import { MembershipsService } from '../../../external/memberships.service';

@Injectable()
export class ReserveHotDeskCommandHandler {
  constructor(
    @Inject('HotDeskReservationRepository')
    private readonly reservationRepository: HotDeskReservationRepository,
    private readonly membershipsService: MembershipsService,
  ) {}

  execute(command: ReserveHotDeskCommand): HotDeskReservation {
    const { userId, date } = command;

    // Validaciones
    if (!userId || typeof userId !== 'string' || !date) {
      throw new Error('400: Bad Request - Invalid input');
    }

    if (this.reservationRepository.findByUserAndDate(userId, date)) {
      throw new Error(
        '409: Conflict - User already has a reservation for this date',
      );
    }

    // Consultar el contexto de Memberships
    const membershipInfo = this.membershipsService.getMembershipInfo(
      userId,
      date,
    );
    const includedInMembership = membershipInfo.remainingCredits > 0;

    // Crear la reserva
    const reservation = new HotDeskReservation(
      userId,
      date,
      includedInMembership,
    );
    this.reservationRepository.save(reservation);

    return reservation;
  }
}
