import { User as BdUser, Card, Product, Purchase } from "@prisma/client";
import { PrismaSession as prisma } from "../../prisma/prismaClient";
import { Pedido } from "./Pedido";
import moment from "moment-timezone";
import axios from "axios";
import server from "../configs/server";

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
  public async getPurchased(): Promise<Purchase[]> { return await Pedido.getAllPedidos(this.userId); }

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
    
      if (!this.getValue("phone")) return;

      const token = await axios.post(server.whapper.routes.login, {username: server.whapper.user, password: server.whapper.password}).then(info => info.data.credentials.token);
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

      await axios.post(
        server.whapper.routes.message,
        {
          key: server.whapper.unique_key,
          destiny: this.getValue("phone"),
          message: `🥮 *GaBrownie Notificações*\n\n${this.getValue("name")}, você realizou uma nova compra no site hoje as ${moment().format("HH:mm")}!\n\nSeu pedido já está sendo separado para o envio, nosso prazo de entrega pode variar de *4* a *9* dias úteis, variando conforme a cidade ou estado onde você mora.\n\n🛒 *Carrinho*\n${productsInfo.map(p => `${p.amount}x${p.brownieName}`).join("\n")}\n*Subtotal = R$${cost.toFixed(2)}*\n\nPara dúvidas, consulte o *SAC 0800 833 4000*`
        },
        {
          headers: {
            Authorization: token
          }
        }
      );
    } catch(err) {
      console.log(err);
    }

  }
}
