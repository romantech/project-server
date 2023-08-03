export const isProd = () => process.env.NODE_ENV === 'production';
export const HOST = isProd() ? process.env.HOST : 'localhost';
export const PORT = isProd() ? Number(process.env.PORT) : 3001;
