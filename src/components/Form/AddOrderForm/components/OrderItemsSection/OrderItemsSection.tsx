// import { OrderInput } from "@/lib/validators/orderSchema";
// import { Inventory } from "@/types";
// import {
//   Control,
//   FieldErrors,
//   useFieldArray,
//   UseFormRegister,
//   useWatch,
// } from "react-hook-form";
// import { Calendar, Plus, RussianRuble, Trash2, Wrench } from "lucide-react";
// import FormField from "@/components/Form/FormField/FormField";
// import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
// import InputWithIcon from "@/components/Form/InventoryForm/InputWithIcon";

// type OrderItemsSectionProps = {
//   control: Control<OrderInput>;
//   register: UseFormRegister<OrderInput>;
//   errors: FieldErrors<OrderInput>;
//   inventory: Inventory[];
//   totalAmount: number;
// };

// export default function OrderItemsSection({
//   control,
//   register,
//   errors,
//   inventory,
//   totalAmount,
// }: OrderItemsSectionProps) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const watchedItems = useWatch({ control, name: "items" });
//   const selectedInventoryIds =
//     watchedItems?.map((i) => i.inventory_id).filter(Boolean) || [];
//   const isAllToolsSelected =
//     selectedInventoryIds.length >= inventory.length && inventory.length > 0;

//   return (
//     <>
//       <h2 className={styles.sectionTitle}>
//         <Wrench size={20} /> Выбор инструмента и сроки
//       </h2>

//       {fields.map((field, index) => (
//         <div key={field.id} className={styles.itemRow}>
//           <div className={styles.itemGrid}>
//             <FormField
//               id={`items.${index}.inventory_id`}
//               label="Инструмент"
//               error={errors.items?.[index]?.inventory_id?.message}
//             >
//               <select
//                 {...register(`items.${index}.inventory_id` as const)}
//                 className={styles.select}
//               >
//                 <option value="">-- Выбрать --</option>
//                 {inventory.map((item) => {
//                   const isAlreadySelected = selectedInventoryIds.includes(
//                     item.id,
//                   );
//                   const isSelectedHere =
//                     watchedItems?.[index]?.inventory_id === item.id;
//                   if (isAlreadySelected && !isSelectedHere) return null;
//                   return (
//                     <option key={item.id} value={item.id}>
//                       {item.name} ({item.daily_price}₽)
//                     </option>
//                   );
//                 })}
//               </select>
//             </FormField>

//             <FormField
//               id={`items.${index}.start_date`}
//               label="Начало"
//               error={errors.items?.[index]?.start_date?.message}
//             >
//               <InputWithIcon
//                 type="date"
//                 id={`items.${index}.start_date`}
//                 icon={Calendar}
//                 register={register(`items.${index}.start_date` as const)}
//               />
//             </FormField>

//             <FormField
//               id={`items.${index}.end_date`}
//               label="Возврат"
//               error={errors.items?.[index]?.end_date?.message}
//             >
//               <InputWithIcon
//                 type="date"
//                 id={`items.${index}.end_date`}
//                 icon={Calendar}
//                 register={register(`items.${index}.end_date` as const)}
//               />
//             </FormField>

//             {fields.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className={styles.removeBtn}
//                 style={{ marginTop: "32px" }}
//               >
//                 <Trash2 size={18} />
//               </button>
//             )}
//           </div>
//         </div>
//       ))}

//       <button
//         type="button"
//         disabled={isAllToolsSelected}
//         onClick={() =>
//           append({
//             inventory_id: "",
//             start_date: new Date().toISOString().split("T")[0],
//             end_date: "",
//           })
//         }
//         className={styles.addToolBtn}
//       >
//         <Plus size={18} /> Добавить инструмент
//       </button>

//       {totalAmount > 0 && (
//         <div className={styles.totalAmountBlock}>
//           <div className={styles.totalLabel}>
//             <span>Общая стоимость</span>
//             <div className={styles.totalAmount}>{totalAmount} ₽</div>
//           </div>
//           <RussianRuble size={32} color="#15803d" opacity={0.2} />
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { OrderInput } from "@/lib/validators/orderSchema";
import { Inventory } from "@/types";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { Calendar, Plus, RussianRuble, Trash2, Wrench } from "lucide-react";
import FormField from "@/components/Form/FormField/FormField";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import InputWithIcon from "@/components/Form/InputWithIcon/InputWithIcon";

type OrderItemsSectionProps = {
  control: Control<OrderInput>;
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  inventory: Inventory[];
  totalAmount: number;
};

export default function OrderItemsSection({
  control,
  register,
  errors,
  inventory,
  totalAmount,
}: OrderItemsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });
  const selectedInventoryIds =
    watchedItems?.map((i) => i.inventory_id).filter(Boolean) || [];
  const isAllToolsSelected =
    selectedInventoryIds.length >= inventory.length && inventory.length > 0;

  // Единственное новое — счётчик дней
  const calcDays = (start: string, end: string) => {
    if (!start || !end) return null;
    const diff = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : null;
  };

  return (
    <>
      {fields.map((field, index) => {
        const start = watchedItems?.[index]?.start_date ?? "";
        const end = watchedItems?.[index]?.end_date ?? "";
        const days = calcDays(start, end);

        return (
          <div key={field.id} className={styles.itemRow}>
            <div className={styles.itemGrid}>
              <FormField
                id={`items.${index}.inventory_id`}
                label="Инструмент"
                error={errors.items?.[index]?.inventory_id?.message}
              >
                <select
                  {...register(`items.${index}.inventory_id` as const)}
                  className={styles.select}
                >
                  <option value=""> Выбрать </option>
                  {inventory.map((item) => {
                    const isAlreadySelected = selectedInventoryIds.includes(
                      item.id,
                    );
                    const isSelectedHere =
                      watchedItems?.[index]?.inventory_id === item.id;
                    if (isAlreadySelected && !isSelectedHere) return null;
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.daily_price}₽)
                      </option>
                    );
                  })}
                </select>
              </FormField>

              <FormField
                id={`items.${index}.start_date`}
                label="Начало"
                error={errors.items?.[index]?.start_date?.message}
              >
                <InputWithIcon
                  type="date"
                  id={`items.${index}.start_date`}
                  icon={Calendar}
                  register={register(`items.${index}.start_date` as const)}
                />
              </FormField>

              <FormField
                id={`items.${index}.end_date`}
                label="Возврат"
                error={errors.items?.[index]?.end_date?.message}
              >
                <InputWithIcon
                  type="date"
                  id={`items.${index}.end_date`}
                  icon={Calendar}
                  register={register(`items.${index}.end_date` as const)}
                />
              </FormField>

              {/* Счётчик дней — новое */}
              <div className={styles.daysBox}>
                <span className={styles.daysBoxLabel}>дней</span>
                <span className={styles.daysBoxValue}>{days ?? "0"}</span>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={styles.removeBtn}
                  style={{ marginTop: "32px" }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        disabled={isAllToolsSelected}
        onClick={() =>
          append({
            inventory_id: "",
            start_date: new Date().toISOString().split("T")[0],
            end_date: "",
          })
        }
        className={styles.addToolBtn}
      >
        <Plus size={18} /> Добавить инструмент
      </button>
    </>
  );
}
