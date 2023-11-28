import { Purchase } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";

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
}