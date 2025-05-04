import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

// Esquema de validación para variables de entorno
const envSchema = z.object({
  PORT: z.number().default(3000),
  DB_URI: z.string().url().min(1),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

// Esquema específico para la configuración del frontend
const frontSchema = z.object({
  PORT: z.number(),
  DB_URI: z.string().url().min(1),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  URLS: z.array(z.string().url())
});

// Validar y exportar las variables
export const config = envSchema.parse({
  PORT: parseInt(process.env.PORT || "4000"),
  DB_URI: process.env.DB_URI,
  NODE_ENV: process.env.NODE_ENV,

});
console.log(`Configuración cargada: ${config.NODE_ENV}`);

export const frontConfig = frontSchema.parse({
  PORT: 8081,
  DB_URI: process.env.DB_URI,
  NODE_ENV: process.env.NODE_ENV,
  URLS: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://10.0.2.2:8081',
    'exp://10.0.2.2:8081'
  ]
});

console.log(`Configuración del front cargada: ${frontConfig.NODE_ENV}`);

// Configuración adicional del servidor (opcional)
export const serverConfig = {
  corsOptions: { origin: "*" },
  helmetOptions: { contentSecurityPolicy: false },
};