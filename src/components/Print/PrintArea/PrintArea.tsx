import { OrderPrintBundle } from "@/types";
import RentalContract from "../RentalContract/RentalContract";

type PrintAreaProps = {
  data: OrderPrintBundle;
  printRef: React.RefObject<HTMLDivElement | null>;
};

export default function PrintArea({ data, printRef }: PrintAreaProps) {
  console.log("[PrintArea] Component rendered. Data exists:", !!data);

  if (!data) {
    console.error("PrintArea: нет данных для печати");
    return null;
  }

  console.log("[PrintArea] Data snapshot:", {
    hasItems: Array.isArray(data.items) && data.items.length > 0,
    hasClient: !!data.client,
    hasOrder: !!data.order,
    clientName: data.client?.first_name,
    itemsCount: data.items?.length,
    // Можно вывести весь объект, если он небольшой, но лучше выборочно
  });

  return (
    // <div style={{ display: "none" }}>
    //   <div ref={printRef}>
    //     <RentalContract
    //       items={data.items}
    //       orderData={{
    //         ...data.client,
    //         ...data.order,
    //       }}
    //     />
    //   </div>
    // </div>
    <div
      style={{
        position: "absolute",
        left: "-9999px", // Убираем за пределы экрана
        top: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <div ref={printRef}>
        <RentalContract
          items={data.items}
          orderData={{
            ...data.client,
            ...data.order,
          }}
        />
      </div>
    </div>
  );
}
