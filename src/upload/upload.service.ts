import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/database/schemas/country.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

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
}
