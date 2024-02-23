import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Dirección de correo electrónico del usuario',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Contraseña del usuario. Debe contener al menos una letra mayúscula, una letra minúscula y un número.',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;
}
