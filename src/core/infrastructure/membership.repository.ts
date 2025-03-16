import { Membership } from '../domain/membership.entity';
import { MembershipCreatedEvent } from '../application/membership/membership.event';

export class MembershipRepository {
  private memberships: Membership[] = [];
  private eventStore: MembershipCreatedEvent[] = [];

  findByUserId(userId: string): Membership | undefined {
    return this.memberships.find((m) => m.userId === userId);
  }

  save(membership: Membership): void {
    this.memberships.push(membership);
  }

  publishEvent(event: MembershipCreatedEvent): void {
    this.eventStore.push(event);
    console.log('Evento publicado:', event);
  }
}
