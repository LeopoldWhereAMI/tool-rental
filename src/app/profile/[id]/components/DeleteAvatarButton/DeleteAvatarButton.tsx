"use client";

import { deleteAvatarAction } from "@/app/profile/actions/actions";
import { toast } from "sonner";
import { useTransition } from "react";
import styles from "../../page.module.css";
import { useRouter } from "next/navigation";

export default function DeleteAvatarButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAvatarAction();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Аватар удалён");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteAvatarBtn}
    >
      {isPending ? "Удаление..." : "Удалить"}
    </button>
  );
}
