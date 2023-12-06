import express from "express";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { User } from "../Entities/User";
import { obscureEmail } from "../utils/obscure.email";
import moment from "moment-timezone";

const auth = express.Router();
const { api } = serverConfigs;

// Rota de login dos usuários na plataforma
auth.post(`${api}/login`, async (req, res) => 
  {
    // Se não forem fornecidas credenciais de acesso a plataforma - sair sem autorização
    if (!req.body.email || !req.body.password) return res.status(401).end();

    // Credenciais
    let { email, password } = req.body;

    const authentication = new ClientAuthentication(email, password);
    await authentication.initializeUser();

    return res.json(authentication.getAuth()).end();
  }
);

auth.get(`${api}/user/info`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    return res.json(
      {
        status: 200, 
        auth: true, 
        data: {
          name: user.getValue("name"),
          email: obscureEmail(user.getValue("email")),
          createdAt: user.getValue("createdAt"),
          isLocked: user.getValue("isLocked"),
          permissionLevel: user.getValue("permissionLevel") == 1 ? "ADMINISTRADOR" : "CLIENTE",
          country: user.getValue("addressCountry"),
          city: user.getValue("addressCity"),
          street: user.getValue("addressStreet"),
          state: user.getValue("addressState"),
          cards: (await user.getCards()).map(card => ({name: card.cardName,flag: card.cardFlag, number: BigInt(card.cardNumber).toString(), cvv: card.cardCVV, validityYear: moment(card.cardValidity).format("YYYY")}))
        }
      }
    ).end();
  }
);

auth.post(`${api}/user/logout`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    const logout = await user.userLogout((req.headers['authorization'] as string).toString());

    if (!logout) return res.json({ status: 426, auth: false, data: null }).end()

    return res.json(
      {
        status: 200, 
        auth: true, 
        data: {
          logout: true
        }
      }
    ).end();
  }
);

export default auth;