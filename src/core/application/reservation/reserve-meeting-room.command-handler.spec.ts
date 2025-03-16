/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ReserveMeetingRoomCommandHandler } from './reserve-meeting-room.command-handler';
import { InMemoryReservationRepository } from './in-memory-reservation.repository';
import { InMemoryMeetingRoomRepository } from '../meeting-room/in-memory-meeting-room.repository';
import { ReserveMeetingRoomCommand } from './reserve-meeting-room.command';
import { Reservation } from '../../domain/reservation.entity';
import { MeetingRoom } from '../../domain/meeting-room.entity';
import { InMemoryHotDeskRepository } from '../hotdesk/in-memory-hotdesk.repository';

describe('ReserveMeetingRoomCommandHandler', () => {
  let handler: ReserveMeetingRoomCommandHandler;
  let reservationRepository: InMemoryReservationRepository;
  let meetingRoomRepository: InMemoryMeetingRoomRepository;
  let hotDeskRepository: InMemoryHotDeskRepository;

  beforeEach(() => {
    reservationRepository = new InMemoryReservationRepository();
    meetingRoomRepository = new InMemoryMeetingRoomRepository();
    hotDeskRepository = new InMemoryHotDeskRepository();

    handler = new ReserveMeetingRoomCommandHandler(
      reservationRepository,
      meetingRoomRepository,
      hotDeskRepository,
    );

    // Crear MeetingRoom con ID manual
    const defaultRoom = new MeetingRoom('Sala A', 10);
    (defaultRoom as any).id = 'meeting-room-123'; // Forzar ID conocido
    meetingRoomRepository.save(defaultRoom);

    // 🔥 Verificar si realmente se ha guardado en el repositorio
    console.log('Salas guardadas en el repositorio:', meetingRoomRepository);
  });

  it('Debería reservar una sala de reuniones con datos válidos', () => {
    const command = new ReserveMeetingRoomCommand(
      'meeting-room-123', // ⚠️ Este ID debe coincidir con el que se guardó en beforeEach
      'user-123',
      '2025-02-20',
      10,
      2,
    );

    console.log('Usando MeetingRoomId en el test:', command.meetingRoomId);

    const result = handler.execute(command);

    expect(result).toBeInstanceOf(Reservation);
    expect(result.meetingRoomId).toBe('meeting-room-123');
  });

  it('Debería lanzar error 404 si la sala de reuniones no existe', () => {
    const command = new ReserveMeetingRoomCommand(
      'sala-inexistente',
      'user-123',
      '2025-02-20',
      10,
      2,
    );
    // eslint-disable-next-line prettier/prettier
    expect(() => handler.execute(command)).toThrow('404: Not Found - MeetingRoom does not exist');
  });

  it('Debería lanzar error 400 si la hora es inválida', () => {
    const room = new MeetingRoom('Sala B', 8);
    meetingRoomRepository.save(room);

    const invalidCommands = [
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', -1, 2), // Hora negativa
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', 25, 2), // Hora fuera de rango
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', 10.5, 2), // Hora decimal
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid data',
      );
    });
  });

  it('Debería lanzar error 400 si la duración es inválida', () => {
    const room = new MeetingRoom('Sala C', 6);
    meetingRoomRepository.save(room);

    const invalidCommands = [
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', 10, -1), // Duración negativa
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', 10, 13), // Duración demasiado larga
      new ReserveMeetingRoomCommand(room.id, 'user-123', '2025-02-20', 10, 1.5), // Duración decimal
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid data',
      );
    });
  });

  it('Debería lanzar error 409 si la sala ya está reservada en esa franja horaria', () => {
    const room = new MeetingRoom('Sala D', 15);
    meetingRoomRepository.save(room);

    // Primera reserva de 10:00 a 12:00
    const command1 = new ReserveMeetingRoomCommand(
      room.id,
      'user-123',
      '2025-02-20',
      10,
      2,
    );
    handler.execute(command1);

    // Segunda reserva que se solapa con la anterior
    const command2 = new ReserveMeetingRoomCommand(
      room.id,
      'user-456',
      '2025-02-20',
      11,
      2,
    );
    expect(() => handler.execute(command2)).toThrow(
      '409: Conflict - MeetingRoom is already reserved for this time slot',
    );
  });
});
