export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Server Error',
  REDIS_ANALYSIS_REMAINING: 'Failed to get analysis remaining count from Redis',
  NOT_FOUND:
    'The requested resource was not found on this server. Please check your request URL and try again.',
  ANALYSIS_INVALID_REQUEST: (fields: string[]) =>
    `${fields.join(', ')} field(s) is(are) required in request body`,
  ANALYSIS_INVALID_MODEL: (validValues: string[]) =>
    `Invalid model value. Allowed values are '${validValues.join("', '")}'`,
} as const;
