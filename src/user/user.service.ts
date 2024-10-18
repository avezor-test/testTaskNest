import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Result } from 'src/database/schemas/result.schema';
import { Country } from 'src/database/schemas/country.schema';
import { CheckResultDto } from './dto/check-result.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
    @InjectModel(Result.name) private resultModel: Model<Result>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updatePassword(
    email: string,
    newPassword: string,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ email }, { password: newPassword }, { new: true })
      .exec();
  }

  async checkAndSaveResult(
    email: string,
    country: string,
    city: string,
  ): Promise<CheckResultDto> {
    const correctEntry = await this.countryModel.findOne({ country }).exec(); // Ищем правильную страну
    const correctCityEntry = await this.countryModel.findOne({ city }).exec(); // Ищем правильный город

    let isCorrect = false;
    let correctCountryForCity: string;
    let correctCityForCountry: string;
    let correctCountryForEnteredCity: string;
    let correctCityForEnteredCountry: string;

    if (!correctEntry) {
      throw new Error('Invalid country');
    }

    if (!correctCityEntry) {
      throw new Error('Invalid city');
    }

    if (correctEntry.city === city) {
      isCorrect = true;
    } else {
      correctCountryForCity = correctEntry.country;
      correctCityForCountry = correctEntry.city;

      correctCountryForEnteredCity = correctCityEntry.country;
      correctCityForEnteredCountry = correctCityEntry.city;
    }

    const newResult = new this.resultModel({
      email,
      country,
      city,
      isCorrect,
    });
    await newResult.save();

    if (!isCorrect) {
      return {
        isCorrect,
        correctCountryForCity,
        correctCityForCountry,
        correctCountryForEnteredCity,
        correctCityForEnteredCountry,
      };
    }

    return { isCorrect };
  }

  async getUserResults(
    email: string,
    page: number = 1,
    limit: number = 10,
    filterBy?: string,
    filterValue?: string,
  ): Promise<{ results: any[]; totalCount: number }> {
    const query = { email };

    if (filterBy && filterValue) {
      query[filterBy] = filterValue;
    }

    const totalCount = await this.resultModel.countDocuments(query);

    const results = await this.resultModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { results, totalCount };
  }
}
