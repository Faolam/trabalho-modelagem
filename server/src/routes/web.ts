
import express from "express";
import serverConfigs from "../configs/server";
import { Produto } from "../Entities/Produto";

const web = express.Router();
const { api } = serverConfigs;

web.get(`${api}/web/listProducts`, async (req, res) => {
  const produtos = await Produto.listAllProducts();

  return res.json({ status: 200, auth: true, data: produtos }).end();
}
);

web.get(`${api}/web/listRatings`, async (req, res) => {
  const ratings = await Produto.listAllRatings();

  return res.json({ status: 200, auth: true, data: ratings }).end();
}
);

web.get(`${api}/web/findProduct`, async (req, res) => {
  if (!req.query.name) return res.json({ status: 432, auth: false, data: null }).end();

  const findedProduct = await Produto.findProductByName(req.query.name.toString());

  return res.json({ status: 200, auth: true, data: findedProduct }).end();
}
);


export default web;