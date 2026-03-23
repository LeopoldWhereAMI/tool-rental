"use client";

import Image from "next/image";
import styles from "../../page.module.css";
import DeleteAvatarButton from "../DeleteAvatarButton/DeleteAvatarButton";
import { UserProfile } from "@/types";
import { useRef, useState } from "react";
import { uploadAvatarAction } from "@/app/profile/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AvatarUploaderProps = {
  profile: UserProfile;
};

export default function AvatarUploader({ profile }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);

      const result = await uploadAvatarAction(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Аватар обновлён");
      router.refresh();
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.avatarWrapper} onClick={handleClick}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        hidden
      />
      {profile?.avatar_url ? (
        <>
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={80}
            height={80}
            className={styles.avatar}
            priority
            unoptimized
          />
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteAvatarButton />
          </div>
        </>
      ) : (
        <>
          <div className={styles.avatarFallback}>
            {profile.full_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <button disabled={loading} className={styles.uploadOverlay}>
            {loading ? "Загрузка..." : "Загрузить"}
          </button>
        </>
      )}
    </div>
  );
}
