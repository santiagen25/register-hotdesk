export class PackageSubscribedEvent {
  constructor(
    public readonly membershipId: string,
    public readonly packageId: string,
    public readonly credits: number,
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
