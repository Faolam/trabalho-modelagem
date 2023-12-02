import { PrismaSession as prisma } from "./prisma/prismaClient";
import moment from "moment-timezone";
(async () => {
  /* const newUser = await prisma.getSession().card.create(
    {
      data: {
        userId: 2,
        cardCVV: 616,
        cardValidity: moment("11/09/2025", "DD/MM/YYYY").toDate(),
        cardFlag: "Visa",
        cardName: "Pedro Henrique G. Alcenio",
        cardNumber: 4904182318004897
      }
    }
  ); */

  /* const newUser = await prisma.getSession().product.updateMany(
    {
      where: {
        brownieCategory: "Frutas Vermelhas"
      },
      data: {
        brownieCategory: "Tradicional"
      }
    }
  ); */

  const newUser = await prisma.getSession().user.update(
    {
      where: {
        id: 2
      },
      data: {
        phone: "32998331768"
      }
    }
  )
  /* const newUser = await prisma.getSession().user.create(
    {
      data: {
        addressCity: "Niterói",
        addressCountry: "Brasil",
        addressNumber: 200,
        addressState: "Rio de Janeiro (RJ)",
        addressStreet: "R. Dr. Luís de Araújo Braz, 199-25 - Serra Grande",
        email: "pedro.alcenio@estudante.ufjf.br",
        name: "Pedro Henrique Gomes Alcenio",
        password: "12345",
        permissionLevel: 1
      }
    }
  ); */
  console.log(newUser);
})()