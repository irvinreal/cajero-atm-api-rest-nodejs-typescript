import winston from 'winston'
const { combine, timestamp, json } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
)

export default function buildLogger(service: string) {
  return {
    log: (message: string) => {
      logger.log('info', { message, service })
    },
    error: (message: string) => {
      logger.error('error', {
        message,
        service
      })
    }
  }
}
