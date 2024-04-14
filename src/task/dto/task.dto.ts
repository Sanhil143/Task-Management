export class CreateTaskDto {
  userId:number;
  description: string;
  due_date: Date;
  asignee: number;
  status: string;
}
export class UpdateTaskDto {
  description: string;
  status: string;
  due_date: Date;
}
