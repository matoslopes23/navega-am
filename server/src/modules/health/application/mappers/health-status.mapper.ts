import { Mapper } from '@shared/mappers/mapper';
import { HealthStatus } from '@modules/health/domain/health-status';

type HealthStatusDTO = {
  status: string;
  service: string;
  timestamp: string;
};

export class HealthStatusMapper implements Mapper<
  HealthStatus,
  HealthStatusDTO
> {
  toDTO(entity: HealthStatus): HealthStatusDTO {
    return {
      status: entity.status,
      service: entity.service,
      timestamp: entity.timestamp,
    };
  }

  toEntity(dto: HealthStatusDTO): HealthStatus {
    return {
      status: 'ok',
      service: 'navega-api',
      timestamp: dto.timestamp,
    };
  }
}
