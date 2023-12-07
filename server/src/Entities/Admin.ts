import { Batches, Purchase } from "@prisma/client";
import { User } from "./User";
import { PrismaSession as prisma } from "../../prisma/prismaClient";

export class Admin extends User {
  constructor(id: number) { super(id); }

  public static async getAllInvoicing(): Promise<{ in: Batches[], out: Purchase[] }> {
    const batchesIn = await prisma.getSession().batches.findMany({});

    let batchesInsertName = [];

    for(let i = 0; i < batchesIn.length; ++i) {
      const product = await prisma.getSession().product.findUnique({where: {id: batchesIn[i].productId}});

      if (!product) continue;

      batchesInsertName.push({...batchesIn[i], price: product.price, brownieName: product.brownieName});
    }

    const purchasesOut = await prisma.getSession().purchase.findMany({});

    return { in: batchesInsertName, out: purchasesOut };
  }

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

      let batchesInsertName = [];

      for(let i = 0; i < batchesIn.length; ++i) {
        const product = await prisma.getSession().product.findUnique({where: {id: batchesIn[i].productId}});

        if (!product) continue;

        batchesInsertName.push({...batchesIn[i], price: product.price, brownieName: product.brownieName});
      }
  
      const purchasesOut = await prisma.getSession().purchase.findMany({
        where: {
          date: {
            gte: inicio,
            lte: fim,
          },
        },
      });
  
      return { in: batchesInsertName, out: purchasesOut };
    } catch (error) {
      // Lidar com erros, como logar ou lançar uma exceção
      console.error('Erro ao obter dados de invoicing:', error);
      throw new Error('Erro ao obter dados de invoicing');
    }
  }

  public static async createAdmin(name: string, email: string, phone: string, password: string): Promise<boolean> {
    try {
      const perfil = await prisma.getSession().user.findFirst({ where: {OR: [{email}, {phone}]} });

      if (perfil) return false;
       
      return await prisma.getSession().user.create(
        {
          data: {
            name,
            password, 
            phone,
            email,
            image: "biuobyK2uYN",
            addressCity: "",
            addressCountry: "",
            addressNumber: 0,
            permissionLevel: 1,
            addressState: "",
            addressStreet: ""
          }
        }
      ).then(() => true);
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}