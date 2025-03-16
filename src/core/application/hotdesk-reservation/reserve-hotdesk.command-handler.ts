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

    if (
      !userId ||
      typeof userId !== 'string' ||
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date
    ) {
      throw new Error('400: Bad Request - Invalid input');
    }

    if (this.reservationRepository.findByUserAndDate(userId, date)) {
      throw new Error(
        '409: Conflict - User already has a reservation for this date',
      );
    }

    const membershipInfo = this.membershipsService.getMembershipInfo(
      userId,
      date,
    );
    const includedInMembership = membershipInfo.remainingCredits > 0;

    const reservation = new HotDeskReservation(
      userId,
      date,
      includedInMembership,
    );
    this.reservationRepository.save(reservation);

    return reservation;
  }
}
