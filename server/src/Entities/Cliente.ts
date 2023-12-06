import { PrismaSession as prisma } from "../../prisma/prismaClient";
import { User } from "./User";

export class Cliente extends User {
  constructor(id: number) { super(id); }

  public static async createClient(name: string, email: string, phone: string, password: string): Promise<boolean> {
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
            addressCity: "",
            addressCountry: "",
            addressNumber: 0,
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