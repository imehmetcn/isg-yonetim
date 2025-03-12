import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Test kullanıcısı oluştur
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      role: "ADMIN",
      password: "test123",
    },
  });

  console.log("Test kullanıcısı oluşturuldu:", user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
