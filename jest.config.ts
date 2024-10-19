import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1', // Для файлов внутри src
    '^decorators/(.*)$': '<rootDir>/../decorators/$1', // Для декораторов в корне
  },
};

export default config;
