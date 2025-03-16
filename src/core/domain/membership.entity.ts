import { Package } from './package.entity';

export class Membership {
  readonly id: string;
  readonly userId: string;
  readonly active: boolean;
  readonly createdAt: Date;
  private packages: Package[] = [];

  constructor(userId: string) {
    this.id = `membership-${userId}`;
    this.userId = userId;
    this.active = true;
    this.createdAt = new Date();
  }

  addPackage(packageInstance: Package): void {
    if (!packageInstance) {
      throw new Error('400: Bad Request - Invalid package');
    }
    this.packages.push(packageInstance);
  }

  getPackages(): Package[] {
    return this.packages;
  }
}
