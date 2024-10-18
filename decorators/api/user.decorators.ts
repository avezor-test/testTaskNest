import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiCheckAndSaveResult() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Check if the provided country and city pair is correct, and save the result',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'The email of the user' },
          country: { type: 'string', description: 'The name of the country' },
          city: { type: 'string', description: 'The name of the city' },
        },
        required: ['email', 'country', 'city'],
      },
    }),
    ApiBearerAuth(),
    ApiResponse({ status: 201, description: 'Result saved successfully' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiGetUserResults() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get paginated results for a user, filtered by various criteria',
    }),
    ApiQuery({ name: 'email', required: true, description: 'User email' }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of results per page',
    }),
    ApiQuery({
      name: 'filterBy',
      required: false,
      description: 'Field to filter by',
    }),
    ApiQuery({
      name: 'filterValue',
      required: false,
      description: 'Value to filter by',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Paginated results fetched successfully',
    }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
