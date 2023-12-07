import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve( __dirname, "../../.env") });

export default {
  port: process.env.SERVER_PORT as string,
  version: process.env.SERVER_VERSION as string,
  ip: process.env.SERVER_LOCATION as string,
  api: process.env.SERVER_API_ROUTE as string,
  secret: process.env.SERVER_AUTH_TOKEN as string,
  whapper: {
    user: process.env.WHAPPER_USER as string,
    password: process.env.WHAPPER_PASSWORD as string,
    unique_key: process.env.WHAPPER_UNIQUE_KEY as string,
    routes: {
      login: process.env.WHAPPER_LOGIN as string,
      message: process.env.WHAPPER_MESSAGE as string
    }
  },
  google: {
    clientId: process.env.WHAPPER_GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.WHAPPER_GOOGLE_CLIENT_SECRET as string,
    refreshToken: process.env.WHAPPER_GOOGLE_REFRESH_TOKEN as string,
    redirectUri: process.env.WHAPPER_GOOGLE_REDIRECT_URI as string
  }
}