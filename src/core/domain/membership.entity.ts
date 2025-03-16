export class Membership {
  readonly id: string;
  readonly userId: string;
  readonly active: boolean;
  readonly createdAt: Date;

  constructor(userId: string) {
    this.id = `membership-${userId}`;
    this.userId = userId;
    this.active = true;
    this.createdAt = new Date();
  }
}
