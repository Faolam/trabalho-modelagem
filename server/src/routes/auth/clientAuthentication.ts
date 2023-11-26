import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import serverConfigs from "../../configs/server";
import { PrismaSession as prisma } from "../../../prisma/prismaClient";

interface AuthenticationResponse {
  status: number,
  auth: boolean,
  data: {
    token: string
  } | null;
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
}