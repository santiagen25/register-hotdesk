import { Injectable, Inject } from '@nestjs/common';
import { RegisterPackageCommand } from './register-package.command';
import { MembershipRepository } from '../../infrastructure/membership.repository';
import { PackageSubscribedEvent } from './package-subscribed.event';
import { Package } from '../../domain/package.entity';

@Injectable()
export class RegisterPackageCommandHandler {
  constructor(
    @Inject('MembershipRepository')
    private readonly membershipRepository: MembershipRepository,
  ) {}

  execute(command: RegisterPackageCommand): Package {
    const { membershipId, credits, year, month } = command;

    if (
      !membershipId ||
      typeof membershipId !== 'string' ||
      membershipId.trim() === ''
    ) {
      throw new Error('400: Bad Request - Invalid membershipId');
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      throw new Error('400: Bad Request - Invalid credits');
    }

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw new Error('400: Bad Request - Invalid date parameters');
    }

    const membership = this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new Error('404: Not Found - Membership does not exist');
    }

    // Crear el paquete con fechas calculadas
    const packageInstance = new Package(credits, year, month);

    // Agregar el paquete a la membresía
    membership.addPackage(packageInstance);
    this.membershipRepository.save(membership);

    // Publicar evento de package registrado
    const event = new PackageSubscribedEvent(
      membershipId,
      packageInstance.id,
      credits,
      packageInstance.startDate,
      packageInstance.endDate,
    );
    this.membershipRepository.publishEvent(event);

    return packageInstance;
  }
}
