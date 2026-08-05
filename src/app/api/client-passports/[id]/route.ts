import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const passport = await prisma.clientPassport.findUnique({
      where: {
        clientId: id,
      },
    });

    if (!passport) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      passport_series: passport.passportSeries,
      passport_number: passport.passportNumber,
      issued_by: passport.issuedBy,
      issue_date: passport.issueDate,
      registration_address: passport.registrationAddress,
    });
  } catch (error) {
    console.error("Ошибка загрузки паспорта:", error);

    return NextResponse.json(
      { message: "Ошибка загрузки паспорта" },
      { status: 500 },
    );
  }
}
