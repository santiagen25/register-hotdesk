import { Injectable, Inject } from '@nestjs/common';
import { RegisterPackageCommand } from './register-package.command';
import { MembershipRepository } from './membership.repository';
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
    const errBadRequestText = '400: Bad Request';

    //creo que es mejor poner los ifs 400 por separado
    //le quita complejidad a la lectura del código
    if (
      !membershipId ||
      typeof membershipId !== 'string' ||
      membershipId.trim() === ''
    ) {
      throw new Error(errBadRequestText);
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      throw new Error(errBadRequestText);
    }

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw new Error(errBadRequestText);
    }

    const membership = this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new Error('404: Not Found - Membership does not exist');
    }

    const packageInstance = new Package(credits, year, month);

    //agregamos paquete a la membresia
    membership.addPackage(packageInstance);
    this.membershipRepository.save(membership);

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
