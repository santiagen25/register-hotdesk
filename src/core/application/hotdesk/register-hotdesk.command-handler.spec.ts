import { RegisterHotDeskCommandHandler } from './register-hotdesk.command-handler';
import { InMemoryHotDeskRepository } from './in-memory-hotdesk.repository';
import { RegisterHotDeskCommand } from './register-hotdesk.command';
import { HotDesk } from './../../domain/hotdesk.entity';

describe('RegisterHotDeskCommandHandler', () => {
  let handler: RegisterHotDeskCommandHandler;
  let repository: InMemoryHotDeskRepository;

  beforeEach(() => {
    repository = new InMemoryHotDeskRepository();
    handler = new RegisterHotDeskCommandHandler(repository);
  });

  it('Deberia registrar un HotDesk con un number valido', () => {
    const command = new RegisterHotDeskCommand(5);
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(HotDesk);
    expect(result.number).toBe(5);
    expect(result.status).toBe('Active');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('Deberia lanzar error 400 si el number no es un entero valido', () => {
    const invalidCommands = [
      new RegisterHotDeskCommand(0), // Menor que 1
      new RegisterHotDeskCommand(-3), // Negativo
      new RegisterHotDeskCommand(null as unknown as number), // Nulo
      new RegisterHotDeskCommand(NaN), // NaN
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid number',
      );
    });
  });

  it('Deberia lanzar error 498 si el number ya existe', () => {
    const command1 = new RegisterHotDeskCommand(10);
    const command2 = new RegisterHotDeskCommand(10);

    handler.execute(command1); // Registro el primero

    expect(() => handler.execute(command2)).toThrow(
      '498: Conflict - HotDesk number already exists',
    );
  });
});
