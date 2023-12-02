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

  public existProduct(): boolean {
    return this.productBdProperties ? true : false;
  }

  public getValue<T extends keyof Product>(key: T): Product[T] {
    return (this.productBdProperties as Product)[key];
  }

  public async updateValue(req: any): Promise<boolean> {
    try {

      console.log(req.body)

      const requestData = {
        batchValidity: req.body?.batchValidity,
        brownieCategory: req.body?.brownieCategory,
        inStock: req.body?.inStock,
        brownieName: req.body?.brownieName,
        price: req.body?.price
      };

      const cleanedData = Object.fromEntries(Object.entries(requestData).filter(([_, v]) => v !== undefined && v !== null));

      await prisma.getSession().product.update(
        {
          where: {
            id: this.productId
          },
          data: cleanedData
        }
      );

      return true;
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  public static async listAllProducts(): Promise<Product[][]> {
    try {
      const produtos = await prisma.getSession().product.findMany({});
      const produtosCategorias: { [categoria: string]: Product[] } = {};
    
      produtos.forEach((produto) => {
        const categoria = produto.brownieCategory;
        if (!produtosCategorias[categoria]) {
          produtosCategorias[categoria] = [produto];
        } else {
          produtosCategorias[categoria].push(produto);
        }
      });
    
      const resultado: Product[][] = Object.values(produtosCategorias);
    
      return resultado;
    } catch(err) {
      console.log(err);
      return [];
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