export class CreateTaskDto {
  description: string;
  due_date: Date;
  asignee: number;
  status: string;
}
export class UpdateTaskDto {
  description: string;
  status: string;
}
