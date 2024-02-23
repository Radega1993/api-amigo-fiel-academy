import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateDogDto {
  @ApiProperty({
    description:
      'Identificador único del perro, generado automáticamente si se omite',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Nombre del perro',
    example: 'Hijo del diablo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Identificador único del usuario propietario del perro',
    example: '456e1234-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;
}
