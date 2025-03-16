import { RegisterMeetingRoomCommandHandler } from './register-meeting-room.command-handler';
import { InMemoryMeetingRoomRepository } from './in-memory-meeting-room.repository';
import { RegisterMeetingRoomCommand } from './register-meeting-room.command';
import { MeetingRoom } from './../../domain/meeting-room.entity';

describe('RegisterMeetingRoomCommandHandler', () => {
  let handler: RegisterMeetingRoomCommandHandler;
  let repository: InMemoryMeetingRoomRepository;

  beforeEach(() => {
    repository = new InMemoryMeetingRoomRepository();
    handler = new RegisterMeetingRoomCommandHandler(repository);
  });

  it('Debería registrar una Meeting Room con un name y un number válidos', () => {
    const command = new RegisterMeetingRoomCommand('Sala A', 10);
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(MeetingRoom);
    expect(result.name).toBe('Sala A');
    expect(result.capacity).toBe(10);
    expect(result.status).toBe('Active');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('Debería lanzar error 400 si la string o el number son incorrectos', () => {
    const invalidCommands = [
      new RegisterMeetingRoomCommand(null as unknown as string, 0), // Nombre incorrecto
      new RegisterMeetingRoomCommand('   ', 1), // Nombre vacio
      new RegisterMeetingRoomCommand('Sala B', 2.5), // Capacidad incorrecto
      new RegisterMeetingRoomCommand('Sala B', -5), // Capacidad negativa
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid name or capacity',
      );
    });
  });

  it('Debería lanzar error 498 si la Meeting Room ya existe', () => {
    const command1 = new RegisterMeetingRoomCommand('Sala A', 10);
    const command2 = new RegisterMeetingRoomCommand('Sala A', 5);

    handler.execute(command1); // Registro el primero

    expect(() => handler.execute(command2)).toThrow(
      '498: Conflict - MeetingRoom name already exists',
    );
  });
});
