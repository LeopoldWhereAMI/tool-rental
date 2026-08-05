import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const passport = await prisma.clientPassport.upsert({
      where: {
        clientId: body.client_id,
      },

      update: {
        passportSeries: body.passport_series,
        passportNumber: body.passport_number,
        issuedBy: body.issued_by,
        issueDate: body.issue_date ? new Date(body.issue_date) : null,
        registrationAddress: body.registration_address,
      },

      create: {
        clientId: body.client_id,

        passportSeries: body.passport_series,
        passportNumber: body.passport_number,
        issuedBy: body.issued_by,
        issueDate: body.issue_date ? new Date(body.issue_date) : null,
        registrationAddress: body.registration_address,
      },
    });

    return NextResponse.json(passport);
  } catch (error) {
    console.error("Ошибка сохранения паспорта:", error);

    return NextResponse.json(
      { message: "Ошибка сохранения паспорта" },
      { status: 500 },
    );
  }
}
