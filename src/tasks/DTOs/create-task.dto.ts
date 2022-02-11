import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'O titulo eh obrigatorio' })
  title: string;

  @IsNotEmpty()
  description: string;
}
