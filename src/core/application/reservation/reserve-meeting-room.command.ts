export class ReserveMeetingRoomCommand {
  constructor(
    public readonly meetingRoomId: string,
    public readonly userId: string,
    public readonly date: string,
    public readonly hour: number,
    public readonly duration: number,
  ) {}
}
