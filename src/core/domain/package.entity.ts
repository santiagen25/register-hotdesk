export class Package {
  readonly id: string;
  readonly credits: number;
  readonly startDate: string;
  readonly endDate: string;

  constructor(credits: number, year: number, month: number) {
    this.id = `package-${Math.random().toString(36).substr(2, 9)}`;
    this.credits = credits;
    this.startDate = new Date(year, month - 1, 1).toISOString(); // Primer día del mes
    this.endDate = new Date(year, month, 0).toISOString(); // Último día del mes
  }
}
