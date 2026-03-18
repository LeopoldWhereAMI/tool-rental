"use client";

import { deleteAvatarAction } from "@/app/profile/actions/actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import styles from "../../page.module.css";

export default function DeleteAvatarButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAvatarAction();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Аватар удалён");
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteAvatarBtn}
    >
      <Trash2 size={16} />
      {isPending ? "Удаление..." : "Удалить аватар"}
    </button>
  );
}
