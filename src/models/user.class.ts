export class User {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: number; // date objekt kann nicht gespeichert werden, daher als string mit "timestamp"
  street: string;
  houseNumber: number;
  zipCode: number;
  city: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.street = obj ? obj.street : '';
    this.houseNumber = obj ? obj.houseNumber : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }
}
