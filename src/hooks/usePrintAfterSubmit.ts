import { useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function usePrintAfterSubmit<T>(
  data: T | null,
  printRef: React.RefObject<HTMLDivElement | null>,
  onComplete?: () => void,
) {
  const router = useRouter();
  console.log(data);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Договор проката",
  });

  useEffect(() => {
    if (!data || !printRef.current) return;

    const printTimer = setTimeout(() => {
      if (printRef.current) {
        handlePrint();

        setTimeout(() => {
          if (onComplete) onComplete(); // Очищаем стейт в родителе
          router.push("/orders");
        }, 1000);
      } else {
        toast.error("Не удалось подготовить область печати");
      }
    }, 500);

    return () => clearTimeout(printTimer);
  }, [data, handlePrint, router, printRef, onComplete]);
}
