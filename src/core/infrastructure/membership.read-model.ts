import { MembershipRepository } from './membership.repository';

export class MembershipReadModel {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  findByUserId(
    userId: string,
  ): { id: string; user_id: string; total_credits: number } | undefined {
    const membership = this.membershipRepository.findByUserId(userId);
    if (!membership) return undefined;

    const totalCredits = membership
      .getPackages()
      .reduce((sum, pkg) => sum + pkg.credits, 0);

    return {
      id: membership.id,
      user_id: membership.userId,
      total_credits: totalCredits,
    };
  }
}
