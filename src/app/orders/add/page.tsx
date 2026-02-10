"use client";

import BackButton from "@/components/BackButton/BackButton";
import AddOrderForm from "@/components/Form/AddOrderForm/AddOrderForm";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

export default function AddOrder() {
  return (
    <PageWrapper>
      <BackButton href="/orders">К списку заказов</BackButton>
      <AddOrderForm />
    </PageWrapper>
  );
}
