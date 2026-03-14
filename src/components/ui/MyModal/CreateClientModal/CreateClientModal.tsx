// "use client";

// import { useState } from "react";
// import FormField from "@/components/Form/FormField/FormField";
// import { X, User, Building2 } from "lucide-react";
// import styles from "./CreateClientModal.module.css";
// import { CreateClientInput } from "@/types";
// import { ClientTypeSelector } from "@/components/Form/ClientTypeSelector/ClientTypeSelector";
// import { useForm } from "react-hook-form";
// import { findCompanyByInn } from "@/services/dadata";

// interface CreateClientModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: CreateClientInput) => Promise<boolean>;
// }

// interface ClientFormValues {
//   client_type: "individual" | "legal";
//   last_name: string;
//   first_name: string;
//   middle_name: string;
//   phone: string;
//   company_name: string;
//   inn: string;
//   kpp: string;
//   ogrn: string;
//   legal_address: string;
// }

// export default function CreateClientModal({
//   isOpen,
//   onClose,
//   onSave,
// }: CreateClientModalProps) {
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit, watch, reset, setValue } =
//     useForm<ClientFormValues>({
//       defaultValues: {
//         client_type: "individual",
//         last_name: "",
//         first_name: "",
//         middle_name: "",
//         phone: "",
//         company_name: "",
//         inn: "",
//         kpp: "",
//         ogrn: "",
//         legal_address: "",
//       },
//     });
//   const [isSearching, setIsSearching] = useState(false);

//   const clientType = watch("client_type");
//   const isIndividual = clientType === "individual";

//   const handleInnSearch = async (inn: string) => {
//     if (inn.length < 10) return;

//     setIsSearching(true);
//     const company = await findCompanyByInn(inn);
//     setIsSearching(false);

//     if (company) {
//       setValue("company_name", company.value || "");
//       setValue("kpp", company.data.kpp || "");
//       setValue("ogrn", company.data.ogrn || "");
//       setValue("legal_address", company.data.address.value || "");
//     }
//   };

//   if (!isOpen) return null;

//   const onSubmit = async (data: ClientFormValues) => {
//     setLoading(true);

//     let submitData: CreateClientInput;

//     if (data.client_type === "individual") {
//       submitData = {
//         client_type: "individual",
//         last_name: data.last_name,
//         first_name: data.first_name,
//         middle_name: data.middle_name,
//         phone: data.phone,
//       } as CreateClientInput;
//     } else {
//       submitData = {
//         client_type: "legal",
//         company_name: data.company_name,
//         inn: data.inn,
//         kpp: data.kpp,
//         ogrn: data.ogrn,
//         legal_address: data.legal_address,
//         phone: data.phone,
//         last_name: data.company_name,
//         first_name: "Юр. лицо",
//         middle_name: "",
//       } as CreateClientInput;
//     }

//     const success = await onSave(submitData);
//     setLoading(false);

//     if (success) {
//       reset();
//       onClose();
//     }
//   };

//   return (
//     <div
//       className={styles.modalOverlay}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className={styles.modal}>
//         <div className={styles.modalHeader}>
//           <h3>Новый клиент</h3>
//           <button onClick={onClose} className={styles.closeBtn}>
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <ClientTypeSelector register={register} />

//           {isIndividual && (
//             <>
//               <div
//                 className={styles.modalGrid}
//                 style={{ gridTemplateColumns: "1fr 1fr" }}
//               >
//                 <FormField label="Фамилия" id="last_name">
//                   <input
//                     required
//                     className={styles.input}
//                     {...register("last_name", { required: true })}
//                     placeholder="Иванов"
//                   />
//                 </FormField>

//                 <FormField label="Имя" id="first_name">
//                   <input
//                     required
//                     className={styles.input}
//                     {...register("first_name", { required: true })}
//                     placeholder="Иван"
//                   />
//                 </FormField>
//               </div>

//               <FormField label="Отчество" id="middle_name">
//                 <input
//                   className={styles.input}
//                   {...register("middle_name")}
//                   placeholder="Иванович"
//                 />
//               </FormField>

//               <FormField label="Телефон" id="phone_individual">
//                 <input
//                   type="tel"
//                   className={styles.input}
//                   {...register("phone")}
//                   placeholder="+7 (999) 000-00-00"
//                 />
//               </FormField>
//             </>
//           )}

//           {!isIndividual && (
//             <>
//               <FormField label="Название компании" id="company_name">
//                 <input
//                   required
//                   className={styles.input}
//                   {...register("company_name", { required: true })}
//                   placeholder="ООО 'Компания'"
//                 />
//               </FormField>

//               <div
//                 className={styles.modalGrid}
//                 style={{ gridTemplateColumns: "1fr 1fr" }}
//               >
//                 <FormField label="ИНН (10 цифр)" id="inn">
//                   <input
//                     required
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={10}
//                     className={styles.input}
//                     {...register("inn", {
//                       required: true,
//                       onChange: (e) => {
//                         const val = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 10);
//                         e.target.value = val;

//                         if (val.length === 10) handleInnSearch(val);
//                       },
//                     })}
//                     placeholder="123456789012"
//                   />
//                 </FormField>

//                 <FormField label="КПП (9 цифр, опционально)" id="kpp">
//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={9}
//                     className={styles.input}
//                     {...register("kpp", {
//                       onChange: (e) => {
//                         e.target.value = e.target.value
//                           .replace(/\D/g, "")
//                           .slice(0, 9);
//                       },
//                     })}
//                     placeholder="123456789"
//                   />
//                 </FormField>
//               </div>

//               <FormField label="ОГРН (опционально)" id="ogrn">
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={15}
//                   className={styles.input}
//                   {...register("ogrn", {
//                     onChange: (e) => {
//                       e.target.value = e.target.value
//                         .replace(/\D/g, "")
//                         .slice(0, 15);
//                     },
//                   })}
//                   placeholder="1234567890123"
//                 />
//               </FormField>

//               <FormField label="Телефон" id="phone_legal">
//                 <input
//                   type="tel"
//                   className={styles.input}
//                   {...register("phone")}
//                   placeholder="+7 (999) 000-00-00"
//                 />
//               </FormField>

//               <FormField label="Юридический адрес" id="legal_address">
//                 <textarea
//                   className={styles.input}
//                   {...register("legal_address")}
//                   placeholder="г. Москва, ул. Ленина, д. 1"
//                   style={{ minHeight: "80px" }}
//                 />
//               </FormField>
//             </>
//           )}

//           <div className={styles.modalActions}>
//             <button
//               type="button"
//               onClick={onClose}
//               className={styles.cancelBtn}
//               disabled={loading}
//             >
//               Отмена
//             </button>
//             <button
//               type="submit"
//               className={styles.submitBtn}
//               disabled={loading}
//             >
//               {loading ? "Сохранение..." : "Создать клиента"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Phone, Loader2 } from "lucide-react";
import { findCompanyByInn } from "@/services/dadata";
import { CreateClientInput } from "@/types";
import { OrderInput } from "@/lib/validators/orderSchema";
import { ClientTypeSelector } from "@/components/Form/ClientTypeSelector/ClientTypeSelector";
import styles from "./CreateClientModal.module.css";
import formStyles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import { IndividualFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/IndividualFields";
import { CompanyFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/CompanyFields";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClientInput) => Promise<boolean>;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSave,
}: CreateClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrderInput>({
    defaultValues: {
      client_type: "individual",
    },
  });

  const clientType = watch("client_type");
  const watchedInn = watch("inn");
  const isIndividual = clientType === "individual";

  useEffect(() => {
    setIsSwitching(true);
    const timer = setTimeout(() => setIsSwitching(false), 200);
    return () => clearTimeout(timer);
  }, [clientType]);

  // Автоматический поиск по ИНН (логика остается в родителе)
  useEffect(() => {
    if (clientType === "legal" && watchedInn?.length === 10) {
      const searchCompany = async () => {
        setIsSearching(true);
        try {
          const company = await findCompanyByInn(watchedInn);
          if (company) {
            setValue("company_name", company.value || "");
            setValue("kpp", company.data.kpp || "");
            setValue("ogrn", company.data.ogrn || "");
            setValue("legal_address", company.data.address.value || "");
          }
        } catch (error) {
          console.error("DaData error:", error);
        } finally {
          setIsSearching(false);
        }
      };
      searchCompany();
    }
  }, [watchedInn, clientType, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: OrderInput) => {
    setLoading(true);

    let submitData: CreateClientInput;

    if (data.client_type === "individual") {
      submitData = {
        client_type: "individual",
        last_name: data.last_name,
        first_name: data.first_name,
        middle_name: data.middle_name,
        phone: data.phone,
        passport_series: data.passport_series,
        passport_number: data.passport_number,
        registration_address: data.registration_address,
      };
    } else {
      submitData = {
        client_type: "legal",
        phone: data.phone || "",
        company_name: data.company_name || "",
        inn: data.inn || "",
        kpp: data.kpp,
        ogrn: data.ogrn,
        legal_address: data.legal_address || "",
      };
    }

    const success = await onSave(submitData as CreateClientInput);
    setLoading(false);

    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Новый клиент</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={formStyles.form}>
          <ClientTypeSelector register={register} />

          <div className={formStyles.fieldGroup} style={{ marginTop: "16px" }}>
            <label className={formStyles.sectionTitle}>
              <Phone
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
                className={styles.phoneIcon}
              />
              <span className={styles.sectionNumber}>1</span>
              Контактный телефон
            </label>
            <input
              {...register("phone", { required: "Телефон обязателен" })}
              className={`${formStyles.input} ${errors.phone ? formStyles.hasError : ""}`}
              placeholder="+7 (999) 000-00-00"
            />
            {errors.phone && (
              <span className={formStyles.errorText}>
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className={styles.fieldsScrollArea}>
            {isSwitching ? (
              <div className={styles.loaderContainer}>
                <Loader2 className={styles.spinner} size={32} />
                <p>Загрузка полей...</p>
              </div>
            ) : (
              <div className={styles.fadeIn}>
                {isIndividual ? (
                  <IndividualFields
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    control={control}
                  />
                ) : (
                  <CompanyFields
                    register={register}
                    errors={errors}
                    isSearching={isSearching}
                  />
                )}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || isSearching}
            >
              {loading ? "Сохранение..." : "Создать клиента"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
