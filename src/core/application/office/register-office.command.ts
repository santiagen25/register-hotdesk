export class RegisterOfficeCommand {
  constructor(
    public readonly number: number,
    public readonly leasePeriod?: number,
    public readonly status?: string,
  ) {}
}
