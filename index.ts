import { Account, PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";

async function run() {
  const prisma = new PrismaClient();

  const accountByIdLoader = new DataLoader<number, Account>((ids) =>
    prisma.account.findMany({
      where: {
        id: { in: ids as number[] },
      },
    })
  );

  const accounts = await prisma.account.findMany();

  console.time("NOT using dataloader");
  await Promise.all(
    accounts.map((account) =>
      prisma.account.findUnique({ where: { id: account.id } })
    )
  );
  console.timeEnd("NOT using dataloader");

  console.time("using dataloader");
  await Promise.all(
    accounts.map((account) => accountByIdLoader.load(account.id))
  );
  console.timeEnd("using dataloader");

  await prisma.$disconnect();
}

run();
