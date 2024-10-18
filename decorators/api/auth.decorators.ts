import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account with the provided email, password, and name.',
    }),
    ApiBody({
      type: CreateUserDto,
      description: 'User registration data',
    }),
    ApiResponse({ status: 201, description: 'User successfully registered' }),
    ApiResponse({
      status: 409,
      description: 'User with this email already exists',
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login and get a JWT token',
      description:
        'User logs in using email and password to receive a JWT token.',
    }),
    ApiBody({
      type: LoginDto,
      description: 'User login credentials',
    }),
    ApiResponse({ status: 200, description: 'Successful login' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({
      summary: 'Logout and invalidate the JWT token',
      description:
        'Logs out the user by their email and invalidates the provided JWT token by adding it to the dead token list.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'The email of the user' },
        },
        required: ['email'],
      },
    }),
    ApiResponse({ status: 201, description: 'Successful logout' }),
    ApiResponse({
      status: 401,
      description: 'Invalid JWT token or user not found',
    }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change the password of the user using email',
      description:
        'Allows the user to change their password by providing their email and new password.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'The email of the user' },
          newPassword: { type: 'string', description: 'The new password' },
        },
        required: ['email', 'newPassword'],
      },
    }),
    ApiResponse({ status: 201, description: 'Password successfully changed' }),
    ApiResponse({ status: 400, description: 'Invalid email or new password' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
