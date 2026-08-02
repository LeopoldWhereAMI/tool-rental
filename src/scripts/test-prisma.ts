import "dotenv/config";
import { prisma } from "@/lib/prisma";

console.log(process.env.DATABASE_URL);

async function main() {
  const clients = await prisma.client.findMany({
    take: 5,
  });

  console.log(clients);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
