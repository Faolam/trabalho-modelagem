import express from "express";
import serverConfigs from "../configs/server";
import { ClientAuthentication } from "./auth/clientAuthentication";

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
    authentication.initializeUser();

    return authentication.getAuth();
  }
);