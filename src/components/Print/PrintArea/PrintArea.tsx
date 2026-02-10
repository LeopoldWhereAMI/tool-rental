import { OrderPrintBundle } from "@/types";
import RentalContract from "../RentalContract/RentalContract";

type PrintAreaProps = {
  data: OrderPrintBundle;
  printRef: React.RefObject<HTMLDivElement | null>;
};

export default function PrintArea({ data, printRef }: PrintAreaProps) {
  if (!data) {
    console.error("PrintArea: нет данных для печати");
    return null;
  }

  return (
    <div style={{ display: "none" }}>
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
