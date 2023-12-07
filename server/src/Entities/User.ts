import { User as BdUser, Card, Product, Purchase, Rating } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";
import { Pedido } from "./Pedido";
import moment from "moment-timezone";
import axios from "axios";
import server from "../configs/server";
import { generateRandomString } from "../utils/generate.random";
import path from "path";
import fs from "fs";
import { gmail } from "../apps/gmail";

interface Products {
  id: number;
  amount: number;
}

export class User {
  /** ID do usuário no banco de dados. */
  public userId: number;
  /** Propiedades do usuário no banco de dados */
  private userBdProperties: BdUser | null = null;

  constructor(userId: number) {
    this.userId = userId;
  }

  /**
   * ***initializeUser***
   * 
   * @description Função responsavel por incializar um usuário, em completude
   * 
   * ```
   * const user = new User(id);
   * user.initializeUser();
   * 
   * if (!user.existUser()) return;
   * 
   * ...
   * ```
  */
  public async initializeUser(): Promise<void> {
    this.userBdProperties = await prisma.getSession().user.findUnique(
      {
        where: {
          id: this.userId
        }
      }
    );
  }

  /**
   * ***existsUser***
   * @description Função responsavel por avaliar se um User existe 
   * @returns boolean - Se o usuário inicializado existe ou não.
   */
  public existsUser(): boolean { return this.userBdProperties ? true : false; }

  /**
   * ***getValue***
   * @description Função responsavel por pegar qualquer valor de um usuário no banco de dados
   * @param key - Parâmetro de busca desejado pelo usuário
   * @returns retorna o parametro armazenado no bancod e dados
   */
  public getValue<T extends keyof BdUser>(key: T): BdUser[T] {
    return (this.userBdProperties as BdUser)[key];
  }

  /**
   * ***getCards***
   * @description Função responsavel por buscar todos os cartões desse usuário no bd
   * @returns Card[] - Um array de cartões de um usuário, pode ser vazio
   */
  public async getCards(): Promise<Card[]> {
    return await prisma.getSession().card.findMany(
      {
        where: {
          userId: this.getValue("id")
        }
      }
    );
  }

  /**
   * ***getType***
   * @description Função responsável por realizar a devolutiva do tipe de usuário que é esse user.
   *
   * @returns Admin ou Cliente dependendo da classificação desse usuário.
   */
  public getType(): "ADMIN" | "CLIENTE" {
    return this.getValue("permissionLevel") == 1 ? "ADMIN" : "CLIENTE";
  }

  /**
   * ***userLogout***
   * @description Função responsavel por deslogar o usuário da plataforma
   * @param token - Token de acesso para deslogar.
   * @returns Booleano, se o usuário foi deslogado ou não com sucesso.
   */
  public async userLogout(token: string): Promise<boolean> {
    try {
      await prisma.getSession().blackList.create(
        {
          data: {
            userId: this.getValue("id"),
            token
          }
        }
      );

      return true;
    } catch(err) {
      return false;
    }
  }

  /**
   * ***getPurchased***
   * 
   * @description Função que devolve todos os pedidos que o usuário relaizou nos ultimos meses.
   * @returns Lista de pedidos realizados por esse usuário
   */
  public async getPurchased(): Promise<{purchase: Purchase, brownieTypes: {amount: number, brownie: Product, ratings: Rating[]}[]}[]> { 
    try {
      const pedidos = await Pedido.getAllPedidos(this.userId);
      const response: {purchase: Purchase, brownieTypes: {amount: number, brownie: Product, ratings: Rating[]}[]}[] = [];

      for (let p = 0; p < pedidos.length; ++p) {
        let pedido = pedidos[p];
        let amontTypes: string[] = [];
        const brwQnt: {amount: number, brownie: Product, ratings: Rating[]}[] = []; // Novo array para cada pedido

        if (pedido.amountTypes.includes("-")) {
          amontTypes = pedido.amountTypes.split("-");
        } else {
          amontTypes = [pedido.amountTypes];
        }

        for (let j = 0; j < amontTypes.length; ++j) {
          const product = await prisma.getSession().product.findUnique({where: {id: parseInt(amontTypes[j].split(",")[0])}});

          if (!product) continue;

          const ratings = await prisma.getSession().rating.findMany({where: {productId: parseInt(amontTypes[j].split(",")[0]) }});

          brwQnt.push({amount: parseInt(amontTypes[j].split(",")[1]), brownie: product, ratings: ratings})
        }

        response.push({purchase: pedido, brownieTypes: brwQnt});
      }

      return response;
    } catch(err) {
      console.log(err);
      return [];
    }
  }

  /**
   * ***insertCard***
   * 
   * @param cardName Nomde do Cartão
   * @param cardNumber Número do cartão
   * @param cardFlag Bandeira do Cartão
   * @param cardCVV CVV do cartão
   * @param cardValidity validade do cartão
   */
  public async insertCard(cardName: string, cardNumber: string, cardFlag: string, cardCVV: string, cardValidity: string): Promise<void> {
    try {
      const existCard = await prisma.getSession().card.findFirst({where: {id: 0}});

      if (!existCard) {
        await prisma.getSession().card.create(
          {
            data: {
              userId: this.getValue("id"),
              cardCVV: parseInt(cardCVV),
              cardFlag,
              cardName,
              cardNumber: parseInt(cardNumber),
              cardValidity: moment(cardValidity, "DD/MM/YYYY").toDate(),
            }
          }
        );
      } else {
        await prisma.getSession().card.update(
          {
            where: {
              id: 0
            },
            data: {
              cardCVV: parseInt(cardCVV),
              cardFlag,
              cardName,
              cardNumber: parseInt(cardNumber),
              cardValidity: moment(cardValidity, "DD/MM/YYYY").toDate(),
            }
          }
        );
      }
    } catch(err) {
      console.log(err);
    }
  }

  /**
   * ***updateAddress***
   * 
   * @param addressCountry pais
   * @param addressStreet rua
   * @param addressNumber numero
   * @param addressState estado
   * @param addressCity cidade
   * @returns void
   */
  public async updateAddress(addressCountry: string, addressStreet: string, addressNumber: number, addressState: string, addressCity: string): Promise<void> {
    await prisma.getSession().user.update(
      {
        where: {
          id: this.getValue("id")
        },
        data: {
          addressCity,
          addressCountry,
          addressNumber,
          addressState,
          addressStreet
        }
      }
    );
    return;
  }

  public async setPicture(picture: string): Promise<boolean> {
    try {
      // Guardando a imagem na pasta de imagens
      const logoPath = generateRandomString(11, false);
      const imagesPath = path.resolve(__dirname, "../images/" + logoPath + ".jpg");
      const response = await axios.get(picture, {responseType: "arraybuffer"});
      const buffer = Buffer.from(response.data, "binary");
      fs.writeFileSync(imagesPath, buffer);

      // Criando o novo Produto no banco de dados.
      await prisma.getSession().user.update(
        {
          where: {
            id: this.getValue("id")
          },
          data: {
            image: logoPath
          }
        }
      );

      return true;
    } catch(err) {
      return false;
    }
  }

  /**
   * ***newPurchase***
   * @param cost custo da compra
   * @param products produtos comprados
   * @returns void
   */
  public async newPurchase(cost: number, products: Products[]): Promise<void> {
    let customString = "";

    for (let i = 0; i < products.length; ++i) {
      if (customString.length !== 0) customString += "-"
      customString += `${products[i].id},${products[i].amount}`
    }

    try {
      await prisma.getSession().purchase.create(
        {
          data: {
            amountTypes: customString,
            cost,
            date: moment().toDate(),
            userId: this.getValue("id")
          }
        }
      );

      let productsInfo: 
        {
          id: number;
          brownieName: string;
          brownieCategory: string;
          avarageRating: number;
          amountRating: number;
          price: number;
          logoPath: string;
          inStock: number;
          batchValidity: Date;
          amount: number;
        }[]
      = [];
    
      for (let i = 0; i < products.length; ++i) {
        let j = await prisma.getSession().product.findUnique(
          {
            where: {
              id: products[i].id
            }
          }
        );

        if (j) {
          await prisma.getSession().product.update(
            {
              where: {
                id: j.id
              },
              data: {
                inStock: j.inStock - products[i].amount
              }
            }
          );

          productsInfo.push({...j, amount: products[i].amount});
        } else continue;
      }

      function createRawEmail(sender: string, to: string, subject: string, body: string) {
        const emailLines = [
          `From: ${sender}`,
          `To: ${to}`,
          'Content-Type: text/html; charset=utf-8',
          `Subject: ${subject}`,
          '',
          body,
        ];
      
        const rawEmail = emailLines.join('\r\n');
        return Buffer.from(rawEmail).toString('base64');
      }

      const htmlBody = `
        <html>
          <body style="text-align: center; font-family: Arial, sans-serif; background-color: #f6f6f6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #8b4513;">Agradecemos pela sua compra!</h1>
              <p>
                Obrigado por escolher os brownies da nossa empresa. 
                Esperamos que você aproveite cada mordida e que essa seja apenas uma de muitas deliciosas experiências.
              </p>
              Detalhes da sua compra:<br>
              ${productsInfo.map(product => `
              <p>
                Produto: ${product.brownieName}<br>
                Quantidade: ${product.amount} unidade<br>
                Total: R$ ${(product.amount*product.price).toFixed(2)}
              </p>
              `)}
              <p style="font-size: 0.8em; color: #777;">
                Este é um e-mail automático. Por favor, não responda a este e-mail.
              </p>
            </div>
          </body>
        </html>
      `;

      const rawEmail = createRawEmail(
        'gabrownie.notificacoes@gmail.com',
        this.getValue("email"),
        'Agradecemos pela sua compra!',
        htmlBody
      );

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawEmail,
        },
      });
    } catch(err) {
      console.log(err);
    }

  }
}
