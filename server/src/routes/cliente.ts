import express from "express";
import { User } from "../Entities/User";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { ValidateCreditCard } from "../utils/valid.credit.card";
import { Produto } from "../Entities/Produto";
import { Cliente } from "../Entities/Cliente";
import axios from "axios";

const cliente = express.Router();
const { api, port, ip } = serverConfigs;

cliente.get(`${api}/user/getPurchases`, ClientAuthentication.isAuthorized, async (req, res) => 
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

    if (!req.body.cardName || !req.body.cardValidity || !req.body.cardNumber || !req.body.cardCVV || !req.body.country || !req.body.street || !req.body.number || !req.body.state || !req.body.city || !req.body.cost || !req.body.products) return res.json({ status: 432, auth: false, data: null }).end();

    const {country, street, number, state, city, cardName, cardValidity, cardNumber, cardCVV, cost, products} = req.body;

    const updateCard = await axios.post(`http://${ip}:${port}${api}/user/newCard`, {cardName, cardValidity, cardNumber, cardCVV}, {headers: {"authorization": req.headers['authorization']}}).catch(err => {console.log(err); return {data: {status: 500}}});

    if (updateCard.data.status !== 200) return res.json({ status: 435, auth: false, data: null }).end();

    await user.updateAddress(country, street, parseInt(number), state, city);

    await user.newPurchase(cost, products);
    
    return res.json(
      { 
        status: 200, 
        auth: true,
        data: null
      }
    );
  }
);

cliente.post(`${api}/user/profilePicture`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (!req.body.cost || !req.body.products) return res.json({ status: 432, auth: false, data: null }).end();

    const {cost, products} = req.body;

    await user.newPurchase(cost, products);
    
    return res.json(
      { 
        status: 200, 
        auth: true,
        data: null
      }
    );
  }
);

cliente.post(`${api}/user/newUser`, async (req, res) => 
  {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) return res.json({ status: 432, auth: false, data: null }).end();

    const {name, email, phone, password} = req.body;

    if (typeof name !== "string") return res.json({ status: 436, auth: false, data: null }).end();
    if (typeof email !== "string") return res.json({ status: 436, auth: false, data: null }).end();
    if (typeof phone !== "string") return res.json({ status: 436, auth: false, data: null }).end();
    if (typeof password !== "string") return res.json({ status: 436, auth: false, data: null }).end();

    if (!password.length) return res.json({ status: 436, auth: false, data: null }).end();
    if (!name.length) return res.json({ status: 436, auth: false, data: null }).end();
    if (!phone.length) return res.json({ status: 436, auth: false, data: null }).end();
    if (!email.length) return res.json({ status: 436, auth: false, data: null }).end();

    const client = await Cliente.createClient(name, email, phone, password);

    if (client) {
      return res.json(
        { 
          status: 200, 
          auth: true,
          data: null
        }
      );
    } else {
      return res.json({ status: 500, auth: false, data: null }).end();
    }
  }
);

cliente.post(`${api}/user/newRating`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (!req.body.productId || !req.body.description || !req.body.stars) return res.json({ status: 432, auth: false, data: null }).end();

    const {productId, description, stars} = req.body;

    const product = new Produto(parseInt(productId.toString()));
    await product.getProduct();

    if (!product.existProduct()) return res.json({ status: 434, auth: true, data: null }).end();

    await product.addRating(user, description.toString(), parseInt(stars.toString()) as (1 | 2 | 3 | 4 | 5));
    
    return res.json(
      { 
        status: 200, 
        auth: true,
        data: null
      }
    );
  }
);


export default cliente;