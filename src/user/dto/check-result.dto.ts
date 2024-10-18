import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckResultDto {
  @ApiProperty({
    description:
      'Indicates whether the user entered the correct city for the given country.',
    example: true,
  })
  isCorrect: boolean;

  @ApiPropertyOptional({
    description:
      'The correct country for the given city, if the input was incorrect.',
    example: 'Germany',
  })
  correctCountryForCity?: string;

  @ApiPropertyOptional({
    description:
      'The correct city for the given country, if the input was incorrect.',
    example: 'Berlin',
  })
  correctCityForCountry?: string;

  @ApiPropertyOptional({
    description:
      'The correct country for the entered city, if the input was incorrect.',
    example: 'France',
  })
  correctCountryForEnteredCity?: string;

  @ApiPropertyOptional({
    description:
      'The correct city for the entered country, if the input was incorrect.',
    example: 'Paris',
  })
  correctCityForEnteredCountry?: string;
}
