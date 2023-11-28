
import express from "express";
import { User } from "../Entities/User";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { Produto } from "../Entities/Produto";
import { Admin } from "../Entities/Admin";

const admin = express.Router();
const { api } = serverConfigs;

admin.post(`${api}/admin/newProduct`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    if (!req.body.name || !req.body.category || !req.body.price || !req.body.image || !req.body.stock || !req.body.validity) return res.json({ status: 432, auth: true, data: null }).end();

    const { name, category, image, price, stock, validity } = req.body;

    const newProduct = await Produto.createProduct(name, category, image, price, stock, validity);

    if (!newProduct) res.json({ status: 500, auth: true, data: null }).end();

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

export default admin;