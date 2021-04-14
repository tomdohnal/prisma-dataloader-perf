# How to run this example
1) Install the dependencies
```bash
yarn
```
2) Migrate the database (SQLite)
```bash
yarn prisma migrate dev
```
3) Seed the database (create 10,000 accounts)
```bash
yarn ts-node seed.ts
```
4) Run the example
```bash
yarn ts-node index.ts
```

As you can see, loading the accounts using `prisma.findUnique(...)` takes much longer than using the `Dataloader`.

As per https://www.prisma.io/docs/guides/prisma-guides/query-optimization-performance#solving-n1-in-graphql-with-findunique-and-prismas-dataloader, Prisma should automatically batch the `findUnique` calls so I wonder why using `Dataloader` significantly increases the performance.
