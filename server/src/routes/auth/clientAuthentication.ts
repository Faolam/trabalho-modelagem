import { User } from "@prisma/client";
import { Admin } from "../../Entities/Admin";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Cliente } from "../../Entities/Cliente";
import serverConfigs from "../../configs/server";
import { User as UserBD } from "../../Entities/User";
import { Response, Request, NextFunction } from "express";
import { PrismaSession as prisma } from "../../../prisma/prismaClient";

interface AuthenticationResponse {
  status: number,
  auth: boolean,
  data: {
    token: string
  } | null;
}

interface CustomRequest extends Request {
  userId?: string;
}

const { secret } = serverConfigs;

export class ClientAuthentication {
  private user: User | null = null;
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  public async initializeUser(): Promise<void> {
    try {
      const user = await prisma.getSession().user.findFirst({
        where: {
          email: this.email,
          password: this.password,
        },
      });

      this.user = user;
    } catch (err) {
      console.error("Erro ao localizar usuário: ", err);
    }
  }

  public getAuth(): AuthenticationResponse {
    if (!this.user) return {status: 401, auth: false, data: null};
    if (this.user.isLocked) return {status: 421, auth: false, data: null};

    // Token de Authenticação Gerado para 2Horas
    let token = jwt.sign( { id: this.user.id }, secret, { expiresIn: "2h" } ); // Token possui 2 horas de validade

    return { status: 200, auth: true, data: { token } };
  }

  public static getClass(user: UserBD): Admin | Cliente {
    return user.getValue("permissionLevel") == 1 ? new Admin(user.getValue("id")) : new Cliente(user.getValue("id"));
  }

  public static async isAuthorized(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) return res.json({ status: 406, auth: false, data: null }).end();

    try {
      const isBlocked = await prisma.getSession().blackList.findFirst(
        {
          where: {
            token: token.toString()
          }
        }
      )

      if (isBlocked) return res.json({ status: 419, auth: false, data: null }).end();
    } catch(err) {
      console.log(err);
      return res.json({ status: 500, auth: false, data: null }).end();
    }

    jwt.verify(token, secret, (err, decoded) => 
      {
        if (err) return res.json({ status: 419, auth: false, data: null }).end();

        const jwtPayload = decoded as JwtPayload;

        req.userId = jwtPayload.id;
        next();
      }
    );
  }
}