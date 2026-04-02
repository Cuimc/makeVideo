import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { getAppEnv } from '../common/config/app-env';
import { PRISMA_DATASOURCE_NAME } from './prisma.constants';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        [PRISMA_DATASOURCE_NAME]: {
          url: getAppEnv().databaseUrl,
        },
      },
    });
  }

  getDatasourceUrl() {
    return getAppEnv().databaseUrl;
  }
}
