import { PrismaClient } from "@prisma/client";

async function run() {
  const prisma = new PrismaClient();

  await prisma.account.deleteMany();

  await Promise.all(
    Array.from(Array(10000)).map((_, i) =>
      prisma.account.create({
        data: {
          name: `First name ${i}`,
          surname: `Surname ${i}`,
          city: `City ${i}`,
        },
      })
    )
  );

  await prisma.$disconnect();
}

run();
