export class RegisterMeetingRoomCommand {
  constructor(
    public readonly name: string,
    public readonly capacity: number,
  ) {}
}
