
import express from "express";
import { User } from "../Entities/User";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";
import { Produto } from "../Entities/Produto";
import { Admin } from "../Entities/Admin";
import moment from "moment-timezone";
import { Pedido } from "../Entities/Pedido";

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

    console.log(req.body);

    if (!req.body.name || !req.body.category || !req.body.price || !req.body.image) return res.json({ status: 432, auth: true, data: null }).end();

    const { name, category, image, price } = req.body;

    const newProduct = await Produto.createProduct(name, category, image, price);

    if (!newProduct) res.json({ status: 500, auth: true, data: null }).end();

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

admin.post(`${api}/admin/addBatch`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    if (!req.body.productId || !req.body.stock || !req.body.validity) return res.json({ status: 432, auth: true, data: null }).end();

    const product = new Produto(parseInt(req.body.productId.toString()));
    await product.getProduct();

    if (!product.existProduct()) return res.json({ status: 434, auth: true, data: null }).end();

    await product.addBatch(parseInt(req.body.stock.toString()), req.body.validity);

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

admin.get(`${api}/admin/getInvoicing`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();


    if (!req.query.dateIn || !req.query.dateOut) {
      const nInvoicing = await Admin.getAllInvoicing();
      return res.json({ status: 200, auth: true, data: nInvoicing }).end();
    };

    const {dateIn, dateOut} = req.query;

    const invoicing = await Admin.getInvoicing(moment(dateIn.toString(), "DD/MM/YYYY").toDate(), moment(moment(dateOut.toString(), "DD/MM/YYYY").toDate()).add(1, 'days').toDate());

    return res.json({ status: 200, auth: true, data: invoicing }).end()
  }
);

admin.post(`${api}/admin/updateProduct`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    if (!req.body.id) return res.json({ status: 433, auth: true, data: null }).end();

    const product = new Produto(parseInt(req.body.id.toString()));
    await product.getProduct();

    if (!product.existProduct()) return res.json({ status: 434, auth: true, data: null }).end();

    await product.updateValue(req);

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

admin.get(`${api}/admin/getAllPurchases`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    const purchases = await Pedido.getAllPedidosEveryBody();
    return res.json({ status: 200, auth: true, data: purchases }).end()
  }
);


admin.post(`${api}/admin/deleteProduct`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    if (!req.body.id) return res.json({ status: 433, auth: true, data: null }).end();

    const product = new Produto(parseInt(req.body.id.toString()));
    await product.getProduct();

    if (!product.existProduct()) return res.json({ status: 434, auth: true, data: null }).end();

    await product.deleteProduct();

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

admin.post(`${api}/admin/updatePedido`, ClientAuthentication.isAuthorized, async (req, res) => 
  {
    // Id do cliente que está acessando essa rota.
    const id = parseInt((req as any).userId) as number;
    const user = new User(id);
    await user.initializeUser();

    if (!user.existsUser()) return res.json({ status: 425, auth: false, data: null }).end();

    if (user.getValue("permissionLevel") == 0) return res.json({ status: 431, auth: true, data: null }).end();

    if (!req.body.productId || !req.body.typeValue) return res.json({ status: 433, auth: true, data: null }).end();

    const pedido = new Pedido(req.body.productId);
    await pedido.findPedido();

    await pedido.Update(parseInt(req.body.typeValue.toString()));

    return res.json({ status: 200, auth: true, data: null }).end()
  }
);

export default admin;