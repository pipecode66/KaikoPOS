type Environment = {
  API_PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
};

export function validateEnv(config: Record<string, unknown>): Environment {
  const apiPort = Number(config.API_PORT ?? 3001);
  const databaseUrl = String(
    config.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/sandeli_pos?schema=public"
  );
  const jwtSecret = String(config.JWT_SECRET ?? "replace-me");
  const jwtExpiresIn = String(config.JWT_EXPIRES_IN ?? "12h");

  if (Number.isNaN(apiPort)) {
    throw new Error("API_PORT must be a valid number");
  }

  if (!databaseUrl.startsWith("postgresql://")) {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection string");
  }

  if (jwtSecret.length < 8) {
    throw new Error("JWT_SECRET must be at least 8 characters long");
  }

  return {
    API_PORT: apiPort,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn
  };
}
