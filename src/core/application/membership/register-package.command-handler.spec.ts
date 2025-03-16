import { RegisterPackageCommandHandler } from './register-package.command-handler';
import { MembershipRepository } from './membership.repository';
import { RegisterPackageCommand } from './register-package.command';
import { Membership } from '../../domain/membership.entity';
import { Package } from '../../domain/package.entity';

describe('RegisterPackageCommandHandler', () => {
  let handler: RegisterPackageCommandHandler;
  let repository: MembershipRepository;

  beforeEach(() => {
    repository = new MembershipRepository();
    handler = new RegisterPackageCommandHandler(repository);

    const membership = new Membership('user-123');
    repository.save(membership);

    console.log('Membresías en el repositorio después de guardar:', repository);
  });

  it('Deberia registrar un package con datos validos', () => {
    const membership = repository.findByUserId('user-123');
    expect(membership).toBeDefined();

    const command = new RegisterPackageCommand(membership!.id, 10, 2025, 5);
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(Package);
    expect(result.credits).toBe(10);
  });

  it('Deberia lanzar error 400 si los datos son invalidos', () => {
    const invalidCommands = [
      new RegisterPackageCommand('', 10, 2025, 5),
      new RegisterPackageCommand('membership-123', 0, 2025, 5),
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow();
    });
  });
});
