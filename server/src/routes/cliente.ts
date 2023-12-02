import express from "express";
import { User } from "../Entities/User";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { ValidateCreditCard } from "../utils/valid.credit.card";

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

cliente.post(`${api}/user/newCard`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (!req.body.cardName || !req.body.cardNumber || !req.body.cardCVV || !req.body.cardValidity) return res.json({ status: 432, auth: false, data: null }).end();

    const {cardName, cardNumber, cardCVV, cardValidity} = req.body;

    const cardFlag = ValidateCreditCard(cardNumber.toString());
    const validFlags = ['Visa', 'MasterCard', 'American Express', 'Discover'];

    if (!validFlags.includes(cardFlag)) return res.json({ status: 435, auth: false, data: null }).end();

    await user.insertCard(cardName.toString(), cardNumber.toString(), cardFlag, cardCVV.toString(), cardValidity.toString())

    return res.json(
      { 
        status: 200, 
        auth: true,
        data: {cardName, cardNumber, cardFlag, cardCVV, cardValidity}
      }
    );
  }
);

cliente.post(`${api}/user/newPurchase`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (!req.body.cost || !req.body.products) return res.json({ status: 432, auth: false, data: null }).end();

    const {cost, products} = req.body;

    await user.newPurchase(cost, products);
    
    return res.json({code: true}).end();
  }
);

export default cliente;