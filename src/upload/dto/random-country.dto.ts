import { ApiProperty } from '@nestjs/swagger';

export class RandomCountryCityDto {
  @ApiProperty({
    description: 'Страна',
    example: 'Afghanistan',
  })
  country: string;

  @ApiProperty({
    description: 'Город',
    example: 'Kabul',
  })
  city: string;
}
