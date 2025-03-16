import { Injectable, Inject } from '@nestjs/common';
import { CreateMembershipCommand } from './create-membership.command';
import { MembershipRepository } from './../../infrastructure/membership.repository';
import { Membership } from '../../domain/membership.entity';
import { MembershipCreatedEvent } from './membership.event';

@Injectable()
export class CreateMembershipCommandHandler {
  constructor(
    @Inject('MembershipRepository')
    private readonly membershipRepository: MembershipRepository,
  ) {}

  execute(command: CreateMembershipCommand): Membership {
    const { userId } = command;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('400: Bad Request - Invalid userId');
    }

    if (this.membershipRepository.findByUserId(userId)) {
      throw new Error('409: Conflict - Membership already exists');
    }

    const membership = new Membership(userId);
    this.membershipRepository.save(membership);

    // Publicamos el evento
    const event = new MembershipCreatedEvent(userId);
    this.membershipRepository.publishEvent(event);

    return membership;
  }
}
