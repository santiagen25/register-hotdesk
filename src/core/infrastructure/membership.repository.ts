import { Membership } from '../domain/membership.entity';
import { MembershipCreatedEvent } from '../application/membership/membership.event';
import { PackageSubscribedEvent } from '../application/membership/package-subscribed.event';

export class MembershipRepository {
  private memberships: Membership[] = [];
  private eventStore: (MembershipCreatedEvent | PackageSubscribedEvent)[] = [];

  findById(id: string): Membership | undefined {
    return this.memberships.find((m) => m.id === id);
  }

  findByUserId(userId: string): Membership | undefined {
    console.log('Buscando membresia para userId:', userId);
    console.log('Estado actual de memberships:', this.memberships);

    return this.memberships.find((m) => m.userId === userId);
  }

  save(membership: Membership): void {
    const existingIndex = this.memberships.findIndex(
      (m) => m.id === membership.id,
    );

    if (existingIndex !== -1) {
      this.memberships[existingIndex] = membership; // Actualiza si ya existe
    } else {
      this.memberships.push(membership); // Agrega una nueva membresia
    }
  }

  publishEvent(event: MembershipCreatedEvent | PackageSubscribedEvent): void {
    this.eventStore.push(event);
    console.log('Evento publicado:', event);
  }
}
