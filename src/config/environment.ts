export const isProd = () => process.env.NODE_ENV === 'production';
export const PORT = isProd() ? process.env.PORT : 3001;
