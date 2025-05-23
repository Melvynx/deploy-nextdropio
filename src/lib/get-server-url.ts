export const getServerUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "production") {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }

  return process.env.VERCEL_URL;
};
