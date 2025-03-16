import { CreateMembershipCommandHandler } from './create-membership.command-handler';
import { MembershipRepository } from '../../infrastructure/membership.repository';
import { CreateMembershipCommand } from './create-membership.command';
import { Membership } from '../../domain/membership.entity';

describe('CreateMembershipCommandHandler', () => {
  let handler: CreateMembershipCommandHandler;
  let repository: MembershipRepository;

  beforeEach(() => {
    repository = new MembershipRepository();
    handler = new CreateMembershipCommandHandler(repository);
  });

  it('✅ Debería crear una membresía con datos válidos', () => {
    const command = new CreateMembershipCommand('user-123');
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(Membership);
    expect(result.userId).toBe('user-123');
    expect(result.active).toBe(true);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('❌ Debería lanzar error 400 si el userId es inválido', () => {
    const invalidCommands = [
      new CreateMembershipCommand(''),
      new CreateMembershipCommand(null as unknown as string),
      new CreateMembershipCommand(123 as unknown as string),
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid userId',
      );
    });
  });

  it('❌ Debería lanzar error 409 si el usuario ya tiene una membresía', () => {
    const command1 = new CreateMembershipCommand('user-123');
    handler.execute(command1); // Primera ejecución

    const command2 = new CreateMembershipCommand('user-123');
    expect(() => handler.execute(command2)).toThrow(
      '409: Conflict - Membership already exists',
    );
  });
});
