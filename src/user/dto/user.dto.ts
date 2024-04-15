export class CreateUserDto {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}
export class UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}
