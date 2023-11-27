import { Product } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";

export class Produto {
  private productId: number;
  private productBdProperties: Product | null = null;

  constructor(id: number) {
    this.productId = id;
  }

  public async getProduct(): Promise<void> {
    this.productBdProperties =  await prisma.getSession().product.findUnique({ where: {id: this.productId} });
    return;
  }

  public getValue<T extends keyof Product>(key: T): Product[T] {
    return (this.productBdProperties as Product)[key];
  }

  public async updateValue<T extends keyof Product, Y extends Product[T]>(key: T, newValue: Y): Promise<boolean> {
    if (key == "id" || key == "amountRating" || key == "avarageRating") return false;

    try {
      await prisma.getSession().product.update(
        {
          where: {
            id: this.productId
          },
          data: {
            [key]: newValue
          }
        }
      );

      return true;
    } catch(err) {
      return false;
    }
  }

  public async addRating(rating: (0 | 1 | 2 | 3 | 4 | 5)): Promise<boolean> {
    try {
      await prisma.getSession().product.update(
        {
          where: {
            id: this.productId
          },
          data: {
            amountRating: this.getValue("amountRating") + 1,
            avarageRating: this.getValue("avarageRating") + (rating/(this.getValue("amountRating") + 1))
          }
        }
      );

      this.productBdProperties = await prisma.getSession().product.findUnique({where: {id: this.productId}});

      return true;
    } catch(err) {
      return false;
    }
  }
}