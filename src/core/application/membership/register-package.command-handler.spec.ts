import { RegisterPackageCommandHandler } from './register-package.command-handler';
import { MembershipRepository } from '../../infrastructure/membership.repository';
import { RegisterPackageCommand } from './register-package.command';
import { Membership } from '../../domain/membership.entity';
import { Package } from '../../domain/package.entity';

describe('RegisterPackageCommandHandler', () => {
  let handler: RegisterPackageCommandHandler;
  let repository: MembershipRepository;

  beforeEach(() => {
    repository = new MembershipRepository();
    handler = new RegisterPackageCommandHandler(repository);

    // ⚠️ Crear y guardar correctamente la membresía
    const membership = new Membership('user-123');
    repository.save(membership);

    // 🔥 Verificar que realmente se guardó la membresía
    console.log('Membresías en el repositorio después de guardar:', repository);
  });

  it('Debería registrar un package con datos válidos', () => {
    const membership = repository.findByUserId('user-123');
    expect(membership).toBeDefined(); // Validar que la membresía existe

    const command = new RegisterPackageCommand(membership!.id, 10, 2025, 5);
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(Package);
    expect(result.credits).toBe(10);
  });

  it('Debería lanzar error 400 si los datos son inválidos', () => {
    const invalidCommands = [
      new RegisterPackageCommand('', 10, 2025, 5), // membershipId vacío
      new RegisterPackageCommand('membership-123', 0, 2025, 5), // credits inválidos
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow();
    });
  });
});
