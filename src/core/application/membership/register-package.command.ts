export class RegisterPackageCommand {
  constructor(
    public readonly membershipId: string,
    public readonly credits: number,
    public readonly year: number,
    public readonly month: number,
  ) {}
}
