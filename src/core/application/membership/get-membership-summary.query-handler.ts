import { Injectable, Inject } from '@nestjs/common';
import { GetMembershipSummaryQuery } from './get-membership-summary.query';
import { MembershipReadModel } from '../../infrastructure/membership.read-model';

@Injectable()
export class GetMembershipSummaryQueryHandler {
  constructor(
    @Inject('MembershipReadModel')
    private readonly membershipReadModel: MembershipReadModel,
  ) {}

  execute(query: GetMembershipSummaryQuery): {
    id: string;
    user_id: string;
    total_credits: number;
  } {
    const { userId } = query;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('400: Bad Request - Invalid userId');
    }

    const membershipSummary = this.membershipReadModel.findByUserId(userId);
    if (!membershipSummary) {
      throw new Error('404: Not Found - Membership does not exist');
    }

    return membershipSummary;
  }
}
