import { Injectable } from '@nestjs/common';
import { getAppEnv } from '../common/config/app-env';

@Injectable()
export class PrismaService {
  getDatasourceUrl() {
    return getAppEnv().databaseUrl;
  }
}
