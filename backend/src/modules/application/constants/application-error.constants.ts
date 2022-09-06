export const APPLICATION_ERRORS = {
  CREATE: {
    LOGIN: {
      message: 'Missing Login link',
      errorCode: 'APP_001',
    },
  },
  GET: {
    message: 'Application Not Found',
    errorCode: 'APP_002',
  },
};

export const ONG_APPLICATION_ERRORS = {
  CREATE: {
    message: 'Error while cerateing the app',
    errorCode: 'ONG_APP_001',
  },
  GET: {
    message: 'Application not found',
    errorCode: 'ONG_APP_002',
  },
  DELETE: { message: 'Could not delete application', errorCode: 'ONG_APP_003' },
};
