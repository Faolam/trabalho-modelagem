import { google } from "googleapis";
import configs from "../configs/server";

const {google: {clientId, clientSecret, refreshToken, redirectUri}} = configs;

const OAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

OAuth2Client.setCredentials(
  {
    refresh_token: refreshToken
  }
);

const gmail = google.gmail(
  {
    version: "v1",
    auth: OAuth2Client
  }
);

export { gmail, OAuth2Client };