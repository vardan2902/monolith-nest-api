import { EntityTarget } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PGDatabaseConnections } from '../db/pg/enums';

export const InjectCurrentRepository = <T>(entity: EntityTarget<T>) => {
  if (typeof entity !== 'function')
    throw new Error('Entity target must be a class constructor');

  const currentHourUTC = new Date().getUTCHours();
  const dataService =
    currentHourUTC >= 0 && currentHourUTC < 12
      ? PGDatabaseConnections.JOBS_0_12
      : PGDatabaseConnections.JOBS_12_24;

  return InjectRepository(entity, dataService);
};
