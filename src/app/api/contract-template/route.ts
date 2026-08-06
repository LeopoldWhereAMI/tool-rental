// import { NextRequest, NextResponse } from "next/server";
// import { DEFAULT_TEMPLATE } from "@/constants/defaultContract";
// import { auth } from "../../../../auth";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const template = await prisma.contractTemplate.findFirst({
//       where: {
//         userId: session.user.id,
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: template?.htmlContent || DEFAULT_TEMPLATE,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Не удалось получить шаблон",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();

//     const { html_content, action } = body;

//     const existing = await prisma.contractTemplate.findFirst({
//       where: {
//         userId: session.user.id,
//       },
//     });

//     // restore

//     if (action === "restore") {
//       if (!existing?.previousHtml) {
//         return NextResponse.json({
//           success: false,
//           error: "Нет предыдущей версии",
//         });
//       }

//       await prisma.contractTemplate.update({
//         where: {
//           id: existing.id,
//         },
//         data: {
//           htmlContent: existing.previousHtml,
//           updatedAt: existing.previousUpdatedAt || new Date(),
//         },
//       });

//       return NextResponse.json({
//         success: true,
//       });
//     }

//     // save

//     await prisma.contractTemplate.upsert({
//       where: {
//         id: existing?.id || "",
//       },

//       create: {
//         userId: session.user.id,
//         htmlContent: html_content,
//       },

//       update: {
//         htmlContent: html_content,
//         previousHtml: existing?.htmlContent,
//         previousUpdatedAt: existing?.updatedAt,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Ошибка сохранения",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_TEMPLATE } from "@/constants/defaultContract";
import { auth } from "../../../../auth";
import {
  getContractTemplate,
  restoreContractTemplate,
  saveContractTemplate,
} from "@/services/contractService";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const template = await getContractTemplate(session.user.id);

    return NextResponse.json({
      success: true,
      data: template?.htmlContent || DEFAULT_TEMPLATE,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить шаблон",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { html_content, action } = body;

    if (action === "restore") {
      await restoreContractTemplate(session.user.id);

      return NextResponse.json({
        success: true,
      });
    }

    await saveContractTemplate(session.user.id, html_content);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ошибка сохранения",
      },
      {
        status: 500,
      },
    );
  }
}
