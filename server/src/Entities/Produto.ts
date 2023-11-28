import fs from "fs";
import path from "path";
import axios from "axios";
import { Product } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";
import { generateRandomString } from "../utils/generate.random";
import moment from "moment-timezone";

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

  public static async createProduct(brownieName: string, brownieCategory: string, image: string, price: number, inStock: number, validity: string): Promise<boolean> {
    try {
      // Guardando a imagem na pasta de imagens
      const logoPath = generateRandomString(11, false);
      const imagesPath = path.resolve(__dirname, "../images/" + logoPath + ".jpg");
      const response = await axios.get(image, {responseType: "arraybuffer"});
      const buffer = Buffer.from(response.data, "binary");
      fs.writeFileSync(imagesPath, buffer);

      // Criando o novo Produto no banco de dados.
      await prisma.getSession().product.create(
        {
          data: {
            batchValidity: moment(validity, "DD/MM/YYYY").toDate(),
            brownieCategory,
            brownieName,
            inStock,
            logoPath,
            price
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