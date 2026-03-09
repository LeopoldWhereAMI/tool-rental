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
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0,
          zIndex: -1,
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
    </>
  );
}
