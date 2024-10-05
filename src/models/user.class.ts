export class User {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: number;
  id: string;
  street: string;
  houseNumber: number;
  zipCode: number;
  city: string;
  followUps: FollowUp[];

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.id = obj ? obj.id : '';
    this.street = obj ? obj.street : '';
    this.houseNumber = obj ? obj.houseNumber : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
    this.followUps =
      obj && obj.followUps
        ? obj.followUps.map((fu: any) => ({
            id: fu.id || '',
            category: fu.category || '',
            createdAt: fu.createdAt || 0,
            deadline: fu.deadline || 0,
            description: fu.description || '',
            title: fu.title || '',
          }))
        : [];
  }
}
