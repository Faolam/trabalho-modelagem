import jwt, { JwtPayload } from "jsonwebtoken";
import serverConfigs from "../configs/server";
import { User as BdUser } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";

interface AccessUser {
  status: number;
  passed: boolean;
}

const { secret } = serverConfigs;

export class User {
  private token: string;
  protected userBdProperties: BdUser | null = null;

  constructor(token: string) {
    this.token = token;
  }

  public async initializeUser(): Promise<AccessUser> {
    try {
      const isBlocked = await prisma.getSession().blackList.findFirst({
        where: {
          token: this.token.toString(),
        },
      });

      if (isBlocked) return { status: 423, passed: false };

      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(this.token, secret, (err, decoded) => {
          if (err) {
            console.error("Erro ao verificar token: ", err);
            reject(err);
          } else {
            resolve(decoded as JwtPayload);
          }
        });
      }) as JwtPayload;

      const user = await prisma.getSession().user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) return { status: 401, passed: false };

      this.userBdProperties = user;

      return { status: 200, passed: true };
    } catch (err) {
      console.error("Erro ao localizar usuário: ", err);

      return { status: 500, passed: false };
    }
  }

  public getValue<T extends keyof BdUser>(key: T): BdUser[T] {
    return (this.userBdProperties as BdUser)[key];
  }
}
