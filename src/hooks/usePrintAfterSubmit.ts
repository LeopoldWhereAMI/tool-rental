import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

// export function usePrintAfterSubmit(
//   printRef: React.RefObject<HTMLDivElement | null>,
//   onComplete?: () => void,
// ) {
//   const router = useRouter();

//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Договор проката",
//     onAfterPrint: () => {
//       if (onComplete) onComplete();
//       router.push("/orders");
//     },
//   });

//   return { handlePrint };
// }

export function usePrintAfterSubmit(
  printRef: React.RefObject<HTMLDivElement | null>,
  onComplete?: () => void,
  orderId?: string | null,
) {
  const router = useRouter();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Договор проката",

    onAfterPrint: () => {
      if (onComplete) onComplete();

      if (orderId) {
        router.push(`/orders/${orderId}`);
      } else {
        router.push("/orders");
      }
    },
  });

  return { handlePrint };
}
