import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatInventory } from "@/lib/formatters/inventoryFormatter";
import { auth } from "../../../../../auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const item = await prisma.inventory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: formatInventory(item),
    });
  } catch (error) {
    console.error("Ошибка загрузки инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки инструмента",
      },
      {
        status: 500,
      },
    );
  }
}

// export async function DELETE(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized",
//         },
//         {
//           status: 401,
//         },
//       );
//     }

//     const { id } = await params;

//     const item = await prisma.inventory.findFirst({
//       where: {
//         id,
//         userId: session.user.id,
//       },
//     });

//     if (!item) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Инструмент не найден",
//         },
//         {
//           status: 404,
//         },
//       );
//     }

//     await prisma.inventory.delete({
//       where: {
//         id,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     console.error("Ошибка удаления:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Ошибка удаления инструмента",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const result = await prisma.inventory.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Ошибка удаления:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка удаления инструмента",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const existingItem = await prisma.inventory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const {
      name,
      category,
      status,
      serial_number,
      daily_price,
      purchase_price,
      purchase_date,
      notes,
    } = body;

    const item = await prisma.inventory.update({
      where: {
        id,
      },
      data: {
        name,
        category,
        status,
        serialNumber: serial_number,
        dailyPrice: daily_price,
        purchasePrice: purchase_price,
        purchaseDate: purchase_date,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      data: formatInventory(item),
    });
  } catch (error) {
    console.error("Ошибка обновления инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления инструмента",
      },
      {
        status: 500,
      },
    );
  }
}
