import { Office } from './../../domain/office.entity';
import { InMemoryOfficeRepository } from './in-memory-office.repository';
import { RegisterOfficeCommand } from './register-office.command';
import { RegisterOfficeCommandHandler } from './register-office.command-handler';

describe('RegisterOfficeCommandHandler', () => {
  let handler: RegisterOfficeCommandHandler;
  let repository: InMemoryOfficeRepository;

  beforeEach(() => {
    repository = new InMemoryOfficeRepository();
    handler = new RegisterOfficeCommandHandler(repository);
  });

  it('Deberia registrar un Office con un number valido', () => {
    const command = new RegisterOfficeCommand(5, 2, 'Active');
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(Office);
    expect(result.number).toBe(5);
    expect(result.leasePeriod).toBe(2);
    expect(result.status).toBe('Active');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('Deberia lanzar error 400 si alguno de los campos es invalido', () => {
    const invalidCommands = [
      new RegisterOfficeCommand(2.5),
      new RegisterOfficeCommand(-3),
      new RegisterOfficeCommand(5, 2.5),
      new RegisterOfficeCommand(5, -3),
      new RegisterOfficeCommand(5, 2, 'Valor no valido'),
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid fields',
      );
    });
  });

  it('Deberia lanzar error 498 si el number del Office ya existe', () => {
    const command1 = new RegisterOfficeCommand(10);
    const command2 = new RegisterOfficeCommand(10);

    handler.execute(command1);

    expect(() => handler.execute(command2)).toThrow(
      '498: Conflict - Office number already exists',
    );
  });
});
