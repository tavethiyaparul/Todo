export default {
  BAD_REQUEST: (message = {}) => ({
    code: "E_BAD_REQUEST",
    message: "The request cannot be fulfilled due to bad syntax",
    status: 400,
    ...message,
  }),

  CREATED: (message = {}) => ({
    code: "CREATED",
    message:
      "The request has been fulfilled and resulted in a new resource being created",
    status: 201,
    ...message,
  }),

  DATA_EXIST: (message = {}) => ({
    code: "ALREADY_EXIST",
    message: "Data already exists",
    status: 403,
    ...message,
  }),

  NOT_FOUND: (message = {}) => ({
    code: "E_NOT_FOUND",
    message:
      "The requested resource could not be found but may be available again in the future",
    status: 404,
    ...message,
  }),

  OK: (message = {}) => ({
    response_code: "SUCCESS",
    message: "Operation is successfully executed",
    status: 200,
    ...message,
  }),

  SERVER_ERROR: (message = {}) => ({
    response_code: "0",
    code: "E_INTERNAL_SERVER_ERROR",
    message: "Something bad happened on the server",
    status: 500,
    ...message,
  }),

  UNAUTHORIZED: (message = {}) => ({
    code: "E_UNAUTHORIZED",
    message: "Missing or invalid authentication",
    status: 401,
    ...message,
  }),

  SUCCESS: (message = {}) => ({
    response_code: "SUCCESS",
    message: "Data retreived successfully",
    status: 200,
    ...message,
  }),

  NOT_SUPPORTED: (message = {}) => ({
    response_code: "NOT_SUPPORTED",
    status: 501,
    ...message,
  }),

  VERIFICATION_SUCCESS: (message = {}) => ({
    response_code: "0",
    message: "Congratulation, you verified successfully.",
    status: 200,
    ...message,
  }),

  DATA_FOUND: (message = {}) => ({
    response_code: "0",
    message: "Data retreived successfully.",
    status: 200,
    ...message,
  }),

  DB_QUERY_ERROR: (message = {}) => ({
    response_code: "1",
    message:
      "Something went wrong with database query, please try again later.",
    status: 502,
    ...message,
  }),

  DATA_NOT_FOUND: (message = {}) => ({
    response_code: "1",
    message: "No Data Found.",
    status: 404,
    ...message,
  }),
};
