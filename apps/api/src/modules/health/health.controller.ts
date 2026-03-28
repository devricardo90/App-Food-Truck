import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Return the technical health status of the API.' })
  @ApiOkResponse({
    description: 'Healthcheck result.',
    schema: {
      example: {
        status: 'ok',
        service: 'api',
        timestamp: '2026-03-28T12:00:00.000Z',
      },
    },
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}
