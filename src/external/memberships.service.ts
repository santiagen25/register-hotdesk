/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipsService {
  getMembershipInfo(
    userId: string,
    _date: string,
  ): {
    membershipId: string;
    remainingCredits: number;
  } {
    //vamos a asumir que el usuario siempre tiene una membresia activa
    return {
      membershipId: 'membership-' + userId,
      remainingCredits: Math.floor(Math.random() * 10), //genera un random entre 0 y 9
    };
  }
}
