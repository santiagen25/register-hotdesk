/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetMembershipSummaryQueryHandler } from './get-membership-summary.query-handler';
import { MembershipReadModel } from '../../infrastructure/membership.read-model';
import { GetMembershipSummaryQuery } from './get-membership-summary.query';

describe('GetMembershipSummaryQueryHandler', () => {
  let handler: GetMembershipSummaryQueryHandler;
  let readModel: MembershipReadModel;

  beforeEach(() => {
    readModel = {
      findByUserId: jest.fn(),
    } as unknown as MembershipReadModel;

    handler = new GetMembershipSummaryQueryHandler(readModel);
  });

  it('Debería devolver el resumen de una membresía existente', () => {
    jest.spyOn(readModel, 'findByUserId').mockReturnValue({
      id: 'membership-123',
      user_id: 'user-123',
      total_credits: 50,
    });

    const query = new GetMembershipSummaryQuery('user-123');
    const result = handler.execute(query);

    expect(result).toEqual({
      id: 'membership-123',
      user_id: 'user-123',
      total_credits: 50,
    });
  });

  it('Debería lanzar error 400 si el userId es inválido', () => {
    const invalidQueries = [
      new GetMembershipSummaryQuery(''), // Vacío
      new GetMembershipSummaryQuery(null as unknown as string), // Null
      new GetMembershipSummaryQuery(123 as unknown as string), // No es string
    ];

    invalidQueries.forEach((query) => {
      expect(() => handler.execute(query)).toThrow(
        '400: Bad Request - Invalid userId',
      );
    });
  });

  it('Debería lanzar error 404 si la membresía no existe', () => {
    jest.spyOn(readModel, 'findByUserId').mockReturnValue(undefined);

    const query = new GetMembershipSummaryQuery('user-456');
    expect(() => handler.execute(query)).toThrow(
      '404: Not Found - Membership does not exist',
    );
  });
});
