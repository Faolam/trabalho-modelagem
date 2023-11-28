import express from "express";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { User } from "../Entities/User";
import { obscureEmail } from "../utils/obscure.email";
import moment from "moment-timezone";

const cliente = express.Router();
const { api } = serverConfigs;

cliente.post(`${api}/user/getPurchases`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    const userClass = ClientAuthentication.getClass(user);

    return res.json(
      { 
        status: 200, 
        auth: true,
        data: {
          ownerName: user.getValue("name"),
          purchases: (await userClass.getPurchased())
        }
      }
    );
  }
);

export default cliente;