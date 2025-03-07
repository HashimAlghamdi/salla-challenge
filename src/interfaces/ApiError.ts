export interface ApiError extends Error {
  response: {
    data: string;
  };
}
