export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Server Error',
  IP_UNIDENTIFIABLE: 'Client IP address not found or unidentifiable',
  RESOURCE_NOT_FOUND:
    'The requested resource was not found on this server. Please check your request URL and try again.',
  ANALYSIS_NO_REMAINING: 'No remaining analysis count available.',
  ANALYSIS_MISSING_FIELDS: (fields: string[]) =>
    `${fields.join(', ')} field(s) is(are) required in request body`,
  ANALYSIS_INVALID_MODEL: (validValues: string[]) =>
    `Invalid model value. Allowed values are '${validValues.join(', ')}'`,
} as const;
