import { Membership } from '../../domain/membership.entity';
import { MembershipCreatedEvent } from './membership.event';
import { PackageSubscribedEvent } from './package-subscribed.event';

export class MembershipRepository {
  private memberships: Membership[] = [];
  private eventStore: (MembershipCreatedEvent | PackageSubscribedEvent)[] = [];

  findById(membershipId: string): Membership | undefined {
    console.log(
      `Buscando membresía en memoria para membershipId: ${membershipId}`,
    );

    //primero buscar en memoria
    let membership = this.memberships.find((m) => m.id === membershipId);
    if (membership) {
      console.log(`Encontrada en memoria:`, membership);
      return membership;
    }

    console.log(`Buscando en eventStore para membershipId: ${membershipId}`);

    const events = this.eventStore.filter(
      (event) =>
        (event instanceof MembershipCreatedEvent &&
          event.userId === membershipId) ||
        (event instanceof PackageSubscribedEvent &&
          event.membershipId === membershipId),
    );

    console.log('📋 Eventos filtrados:', events);

    if (events.length === 0) {
      console.log('No se encontró membresía en eventStore.');
      return undefined;
    }

    //encontrar el evento de creación de la membresía
    const firstEvent = events.find(
      (event) => event instanceof MembershipCreatedEvent,
    );
    if (!firstEvent) {
      console.log('No se encontró un evento de creación de membresía.');
      return undefined;
    }

    //creamos la membresía desde el evento de creación
    membership = new Membership(firstEvent.userId);
    membership.applyEvents(events);

    //guardar en memoria para furtaas consultasa
    this.memberships.push(membership);

    console.log(`Estado reconstruido de la membresía:`, membership);
    return membership;
  }

  findByUserId(userId: string): Membership | undefined {
    console.log(`Buscando membresía en memoria para userId: ${userId}`);
    console.log('Estado actual de memberships:', this.memberships);

    let membership = this.memberships.find((m) => m.userId === userId);

    if (!membership) {
      console.log('No encontrada en memoria, intentando reconstrucción...');
      membership = this.findById(userId);
      if (membership) {
        this.memberships.push(membership);
      }
    }

    return membership;
  }

  save(membership: Membership): void {
    const existingIndex = this.memberships.findIndex(
      (m) => m.id === membership.id,
    );
    if (existingIndex !== -1) {
      this.memberships[existingIndex] = membership;
    } else {
      this.memberships.push(membership);
    }
    console.log('Membresía guardada:', membership);
  }

  publishEvent(event: MembershipCreatedEvent | PackageSubscribedEvent): void {
    this.eventStore.push(event);
    console.log('Evento publicado:', event);
    console.log(
      'Estado actual del eventStore:',
      JSON.stringify(this.eventStore, null, 2),
    );
  }
}
