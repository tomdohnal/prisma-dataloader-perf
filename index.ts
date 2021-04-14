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

  console.time("multiple `prisma.findFirst(...)` calls");
  await Promise.all(
    accounts.map((account) =>
      prisma.account.findFirst({ where: { id: account.id } })
    )
  );
  console.timeEnd("multiple `prisma.findFirst(...)` calls");

  console.time("multiple `prisma.findUnique(...)` calls");
  await Promise.all(
    accounts.map((account) =>
      prisma.account.findUnique({ where: { id: account.id } })
    )
  );
  console.timeEnd("multiple `prisma.findUnique(...)` calls");

  console.time("using DataLoader");
  await Promise.all(
    accounts.map((account) => accountByIdLoader.load(account.id))
  );
  console.timeEnd("using DataLoader");

  console.time("`prisma.findMany(...)`");
  await prisma.account.findMany({
    where: { id: { in: accounts.map((account) => account.id) } },
  });
  console.timeEnd("`prisma.findMany(...)`");

  await prisma.$disconnect();
}

run();
