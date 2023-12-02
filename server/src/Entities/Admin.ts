import { Batches, Purchase } from "@prisma/client";
import { User } from "./User";
import { PrismaSession as prisma } from "../../prisma/prismaClient";

export class Admin extends User {
  constructor(id: number) { super(id); }

  public static async getInvoicing(inicio: Date, fim: Date): Promise<{ in: Batches[], out: Purchase[] }> {
    try {
      const batchesIn = await prisma.getSession().batches.findMany({
        where: {
          createdAt: {
            gte: inicio,
            lte: fim,
          },
        },
      });
  
      const purchasesOut = await prisma.getSession().purchase.findMany({
        where: {
          date: {
            gte: inicio,
            lte: fim,
          },
        },
      });
  
      return { in: batchesIn, out: purchasesOut };
    } catch (error) {
      // Lidar com erros, como logar ou lançar uma exceção
      console.error('Erro ao obter dados de invoicing:', error);
      throw new Error('Erro ao obter dados de invoicing');
    }
  }
}