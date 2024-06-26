import 'dotenv/config'
import * as Joi from 'joi'

interface EnvVars {
    PORT: number
    DATABASE_URL: string
}

const envVarsSchema = Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required()
}).unknown(true).required()

const { error, value } = envVarsSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL
}