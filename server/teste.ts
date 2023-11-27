import { PrismaSession as prisma } from "./prisma/prismaClient";
import moment from "moment-timezone";
(async () => {
  const newUser = await prisma.getSession().card.create(
    {
      data: {
        userId: 1,
        cardCVV: 821,
        cardValidity: moment("29/05/2024", "DD/MM/YYYY").toDate(),
        cardFlag: "MasterCard",
        cardName: "Reginaldo Batista de S. Gomes",
        cardNumber: 5478488875782129
      }
    }
  );
  console.log(newUser);
})()