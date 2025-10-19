import { registerAs } from '@nestjs/config';
import { config as dotEnvConfig } from 'dotenv';
import { get } from 'env-var';

dotEnvConfig();

export interface IAppConfig {
  port: number;
}

const configFactory = (): IAppConfig => ({
  port: get('APP_PORT').default(3000).asPortNumber(),
});

export const appConfig = registerAs('app', configFactory);
