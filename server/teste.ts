import { PrismaSession as prisma } from "./prisma/prismaClient";

(async () => {
  const newUser = await prisma.getSession().user.create(
    {
      data: {
        email: "reginaldobatista@gmail.com",
        name: "Reginaldo Batista de Souza Gomes",
        password: "12345",
        addressCity: "Juíz de Fora",
        addressCountry: "Brasil",
        addressState: "Minas Gerais (MG)",
        addressStreet: "Rua Rogério Morales",
        addressNumber: 161
      }
    }
  );
  console.log(newUser);
})()