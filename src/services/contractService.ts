import { prisma } from "@/lib/prisma";

export async function getContractTemplate(userId: string) {
  return prisma.contractTemplate.findFirst({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function saveContractTemplate(
  userId: string,
  htmlContent: string,
) {
  const existing = await prisma.contractTemplate.findFirst({
    where: {
      userId,
    },
  });

  if (!existing) {
    return prisma.contractTemplate.create({
      data: {
        userId,
        htmlContent,
      },
    });
  }

  return prisma.contractTemplate.update({
    where: {
      id: existing.id,
    },

    data: {
      htmlContent,
      previousHtml: existing.htmlContent,
      previousUpdatedAt: existing.updatedAt,
    },
  });
}

export async function restoreContractTemplate(userId: string) {
  const existing = await prisma.contractTemplate.findFirst({
    where: {
      userId,
    },
  });

  if (!existing?.previousHtml) {
    throw new Error("Нет предыдущей версии");
  }

  return prisma.contractTemplate.update({
    where: {
      id: existing.id,
    },

    data: {
      htmlContent: existing.previousHtml,
      previousHtml: existing.htmlContent,
      previousUpdatedAt: existing.updatedAt,
    },
  });
}
