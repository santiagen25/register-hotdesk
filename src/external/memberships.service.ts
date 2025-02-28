import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipsService {
  getMembershipInfo(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _date: string,
  ): {
    membershipId: string;
    remainingCredits: number;
  } {
    // Simulación: Asumimos que el usuario siempre tiene una membresía activa con créditos
    return {
      membershipId: 'membership-' + userId,
      remainingCredits: Math.floor(Math.random() * 10), // Simula créditos restantes entre 0 y 9
    };
  }
}
