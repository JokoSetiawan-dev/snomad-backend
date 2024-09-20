import morgan from 'morgan';

export const logger = (env: string) => {
  if (env === 'development') {
    return morgan('dev'); // Logs requests in dev format (colored output)
  } else {
    return morgan('combined'); // Logs requests in Apache combined format for production
  }
};