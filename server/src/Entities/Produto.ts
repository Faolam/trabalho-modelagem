import fs from "fs";
import path from "path";
import axios from "axios";
import { User } from "./User";
import { Product, Rating } from "@prisma/client";
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

      const requestData = {
        brownieCategory: req.body?.brownieCategory,
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
      let produtos = await prisma.getSession().product.findMany({});
      const produtosCategorias: { [categoria: string]: Product[] } = {};

      for (let i = 0; i < produtos.length; ++i) {
        let lotes = await prisma.getSession().batches.findMany({where: {productId: produtos[i].id}});
        let amount = 0;

        lotes.map(lote => amount = amount + lote.stock);
        
        produtos[i].inStock += amount
      }
    
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

  public static async createProduct(brownieName: string, brownieCategory: string, image: string, price: number): Promise<boolean> {
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
            batchValidity: moment().toDate(),
            brownieCategory,
            brownieName,
            inStock: 0,
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

  public static async listAllRatings(): Promise<Rating[]> {
    return await prisma.getSession().rating.findMany({});
  }

  public async addBatch(stock: number, validity: string): Promise<void> {
    await prisma.getSession().batches.create(
      {
        data: {
          batchValidity: moment(validity, "DD/MM/YYYY").toDate(),
          productId: this.getValue("id"),
          stock
        }
      }
    );
  }

  public static async findProductByName(name: string): Promise<any | null> {
    try {
      const product = await prisma.getSession().product.findMany({ where: {brownieName: {startsWith: name}} });

      if (!product.length) return null

      let ratingsNew: {}[] = [];
      const ratings = await prisma.getSession().rating.findMany({where: {productId: product[0].id }});

      for (let i = 0; i < ratings.length; ++i) {
        const user = await prisma.getSession().user.findUnique({where: {id: ratings[i].userId}});

        ratingsNew.push({ ...ratings[i], userName: user?.name, userImage: user?.image });
      }

      return {...product[0], ratings: ratingsNew};
    } catch(err) {
      console.log(err);
      return null;
    }
  }

  public async addRating(user: User, description: string, rating: (0 | 1 | 2 | 3 | 4 | 5)): Promise<boolean> {
    try {
      const hasRating = await prisma.getSession().rating.findFirst(
        {
          where: {
            userId: user.getValue("id")
          }
        }
      );

      if (hasRating) return false;

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

      await prisma.getSession().rating.create(
        {
          data: {
            comment: description,
            productId: this.getValue("id"),
            date: moment().toDate(),
            starts: rating,
            userId: user.getValue("id")
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