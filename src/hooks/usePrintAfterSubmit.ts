// import { useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export function usePrintAfterSubmit<T>(
//   data: T | null,
//   printRef: React.RefObject<HTMLDivElement | null>,
//   onComplete?: () => void,
// ) {
//   const router = useRouter();

//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Договор проката",
//   });

//   useEffect(() => {
//     if (!data || !printRef.current) return;

//     const printTimer = setTimeout(() => {
//       if (printRef.current) {
//         handlePrint();

//         setTimeout(() => {
//           if (onComplete) onComplete();
//           router.push("/orders");
//         }, 1000);
//       } else {
//         toast.error("Не удалось подготовить область печати");
//       }
//     }, 500);

//     return () => clearTimeout(printTimer);
//   }, [data, handlePrint, router, printRef, onComplete]);
// }

import { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

export function usePrintAfterSubmit<T>(
  data: T | null,
  printRef: React.RefObject<HTMLDivElement | null>,
  onComplete?: () => void,
) {
  const router = useRouter();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Договор проката",
    onAfterPrint: () => {
      console.log("✅ Печать завершена");

      // Сначала очищаем данные
      if (onComplete) {
        onComplete();
      }

      // Потом перенаправляем
      router.push("/orders");
    },
  });

  useEffect(() => {
    if (!data) return;

    console.log("🖨️ Данные получены, запускаем печать через 500ms");

    const timer = setTimeout(() => {
      if (printRef.current) {
        console.log("🖨️ Вызов handlePrint");
        handlePrint();
      } else {
        console.error("❌ printRef.current отсутствует");
        // Если нет ref, все равно перенаправляем
        if (onComplete) onComplete();
        router.push("/orders");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [data, handlePrint, printRef, router, onComplete]);
}
