import { Purchase } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";
import { User } from "./User";

export class Pedido {
  private pedidoId: number;
  private purchaseBdProperties: Purchase | null = null;

  constructor(id: number) {
    this.pedidoId = id;
  }

  public async findPedido(): Promise<void> {
    this.purchaseBdProperties =  await prisma.getSession().purchase.findUnique({ where: {id: this.pedidoId} });
    return;
  }

  public getValue<T extends keyof Purchase>(key: T): Purchase[T] {
    return (this.purchaseBdProperties as Purchase)[key];
  }

  public static async getAllPedidos(userId: number): Promise<Purchase[]> {
    return await prisma.getSession().purchase.findMany({ where: { userId } });
  }

  public static async getAllPedidosEveryBody(): Promise<any[]> {
    const usersBd = await prisma.getSession().user.findMany({});

    const purchases = [];

    for(let i = 0; i < usersBd.length; ++i) {
      const user = new User(usersBd[i].id);
      await user.initializeUser();

      if (!user.existsUser()) continue;

      const pedidos = await prisma.getSession().purchase.findMany({where: {userId:user.getValue("id")}});

      if (!pedidos.length) continue;

      const formatedPedidos = await user.getPurchased();

      purchases.push({purchases: formatedPedidos, addressCity: user.getValue("addressCity"), addressCountry: user.getValue("addressCountry"), addressNumber: user.getValue("addressNumber"), addressState: user.getValue("addressState"), ownerName: user.getValue("name") })
    }
    
    return purchases;
  }
}