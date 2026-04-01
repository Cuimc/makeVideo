export interface AppEnv {
  port: number;
  swaggerPath: string;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
}

export function getAppEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  return {
    port: Number(env.PORT ?? 3000),
    swaggerPath: env.SWAGGER_PATH ?? 'docs',
    databaseUrl:
      env.DATABASE_URL ?? 'mysql://root:password@127.0.0.1:3306/make_video',
    redisUrl: env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    jwtSecret: env.JWT_SECRET ?? 'dev-jwt-secret',
  };
}
