import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve( __dirname, "../../.env") });

export default {
  port: process.env.SERVER_PORT as string,
  version: process.env.SERVER_VERSION as string,
  ip: process.env.SERVER_LOCATION as string,
  api: process.env.SERVER_API_ROUTE as string,
  secret: process.env.SERVER_AUTH_TOKEN as string
}