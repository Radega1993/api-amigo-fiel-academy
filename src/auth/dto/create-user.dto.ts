import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsUUID,
  IsOptional,
  IsArray,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
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
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @MinLength(1)
  surname: string;

  @ApiProperty({
    description:
      'Lista de identificadores UUID de restaurantes asociados al usuario',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  restaurants?: string[];
}
