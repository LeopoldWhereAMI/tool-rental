import { ContractOrderData, OrderPrintBundle } from "@/types";
import RentalContract from "../RentalContract/RentalContract";

type PrintAreaProps = {
  data: OrderPrintBundle;
  printRef: React.RefObject<HTMLDivElement | null>;
  onReady?: () => void;
};

export default function PrintArea({ data, printRef, onReady }: PrintAreaProps) {
  if (!data) {
    console.error("PrintArea: нет данных для печати");
    return null;
  }

  return (
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
            orderData={
              {
                ...data.client,
                ...data.order,
              } as unknown as ContractOrderData
            }
            onReady={onReady}
          />
        </div>
      </div>
    </>
  );
}
