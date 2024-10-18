import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/database/schemas/country.schema';
import { RandomCountryCityDto } from './dto/random-country.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  private shuffleArray(array: any[]): any[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  async saveCountries(data: any[]): Promise<void> {
    const countries = data.map((entry) => ({
      country: entry.country,
      city: entry.city,
    }));

    for (const country of countries) {
      const existingCountry = await this.countryModel.findOne({
        country: country.country,
      });

      if (!existingCountry) {
        await this.countryModel.create(country);
      }
    }
  }
  async getRandomCountry(): Promise<RandomCountryCityDto[]> {
    const countries = await this.countryModel.find().exec();
    const cities = countries.map((item) => item.city);

    let shuffledCities = this.shuffleArray(cities);

    let isValidShuffle = false;

    while (!isValidShuffle) {
      shuffledCities = this.shuffleArray(cities);

      isValidShuffle = countries.every(
        (country, index) => country.city !== shuffledCities[index],
      );
    }

    return countries.map((country, index) => ({
      country: country.country,
      city: shuffledCities[index],
    }));
  }
}
