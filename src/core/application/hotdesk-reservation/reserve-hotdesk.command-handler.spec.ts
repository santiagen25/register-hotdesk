import { ReserveHotDeskCommandHandler } from './reserve-hotdesk.command-handler';
import { InMemoryHotDeskReservationRepository } from './in-memory-hotdesk-reservation.repository';
import { ReserveHotDeskCommand } from './reserve-hotdesk.command';
import { HotDeskReservation } from '../../domain/hotdesk-reservation.entity';
import { MembershipsService } from '../../../external/memberships.service';

describe('ReserveHotDeskCommandHandler', () => {
  let handler: ReserveHotDeskCommandHandler;
  let reservationRepository: InMemoryHotDeskReservationRepository;
  let membershipsService: MembershipsService;

  beforeEach(() => {
    reservationRepository = new InMemoryHotDeskReservationRepository();
    membershipsService = new MembershipsService();
    handler = new ReserveHotDeskCommandHandler(
      reservationRepository,
      membershipsService,
    );
  });

  it('Deberia reservar un HotDesk con datos validos', () => {
    const command = new ReserveHotDeskCommand('user-123', '2025-02-20');
    const result = handler.execute(command);

    expect(result).toBeInstanceOf(HotDeskReservation);
    expect(result.userId).toBe('user-123');
    expect(result.date).toBe('2025-02-20');
    expect(result.status).toBe('Active');
    expect(typeof result.includedInMembership).toBe('boolean'); // Puede ser true o false
  });

  it('Deberia lanzar error 400 si el userId es invalido', () => {
    const invalidCommands = [
      new ReserveHotDeskCommand('', '2025-02-20'), // userId vacío
      new ReserveHotDeskCommand(null as unknown as string, '2025-02-20'), // userId null
      new ReserveHotDeskCommand(123 as unknown as string, '2025-02-20'), // userId numérico
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid input',
      );
    });
  });

  it('Deberia lanzar error 400 si la fecha es inválida', () => {
    const invalidCommands = [
      new ReserveHotDeskCommand('user-123', ''), // Fecha vacía
      new ReserveHotDeskCommand('user-123', null as unknown as string), // Fecha null
      new ReserveHotDeskCommand('user-123', 'not-a-date'), // Texto no fecha
      new ReserveHotDeskCommand('user-123', '2025-02-30'), // Día invalido (febrero 30)
      new ReserveHotDeskCommand('user-123', '2025-13-01'), // Mes invalido (mes 13)
      new ReserveHotDeskCommand('user-123', '2025-00-10'), // Mes 00
      new ReserveHotDeskCommand('user-123', 'abcd-ef-gh'), // Totalmente invalido
    ];

    invalidCommands.forEach((command) => {
      expect(() => handler.execute(command)).toThrow(
        '400: Bad Request - Invalid input',
      );
    });
  });

  it('Deberia lanzar error 409 si el usuario ya tiene una reserva para esa fecha', () => {
    const command1 = new ReserveHotDeskCommand('user-123', '2025-02-20');
    handler.execute(command1); // Primera reserva exitosa

    const command2 = new ReserveHotDeskCommand('user-123', '2025-02-20');
    expect(() => handler.execute(command2)).toThrow(
      '409: Conflict - User already has a reservation for this date',
    );
  });

  it('Deberia asignar correctamente si la reserva está cubierta por la membresia', () => {
    jest.spyOn(membershipsService, 'getMembershipInfo').mockReturnValue({
      membershipId: 'membership-user-123',
      remainingCredits: 5, // Simulamos que tiene créditos disponibles
    });

    const command = new ReserveHotDeskCommand('user-123', '2025-02-20');
    const result = handler.execute(command);

    expect(result.includedInMembership).toBe(true);
  });

  it('Deberia asignar correctamente si la reserva NO está cubierta por la membresia', () => {
    jest.spyOn(membershipsService, 'getMembershipInfo').mockReturnValue({
      membershipId: 'membership-user-123',
      remainingCredits: 0, // Simulamos que NO tiene créditos disponibles
    });

    const command = new ReserveHotDeskCommand('user-123', '2025-02-20');
    const result = handler.execute(command);

    expect(result.includedInMembership).toBe(false);
  });
});
