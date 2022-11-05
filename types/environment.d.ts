namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    MONGODB_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_URL: string;
    JWT_SECRET: string;
  }
}
