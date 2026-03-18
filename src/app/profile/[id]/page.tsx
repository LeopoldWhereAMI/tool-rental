import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { getProfile } from "@/services/profileService";
import Image from "next/image";
import AvatarUploadForm from "./components/AvatarUploadForm/AvatarUploadForm";
import ProfileNameForm from "./components/ProfileNameForm/ProfileNameForm";
import DeleteAvatarButton from "./components/DeleteAvatarButton/DeleteAvatarButton";
import RentalReceiptEditor from "@/components/Print/RentalReceipt/RentalReceiptEditor/RentalReceiptEditor";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            Карточка пользователя {profile.full_name || ""}
          </h1>
          <span className={styles.subTitle}>
            Просмотр и управление данными аккаунта.
          </span>
        </div>
        <div className={styles.avatarWrapper}>
          {profile?.avatar_url ? (
            <>
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={100}
                height={100}
                className={styles.avatar}
                priority
              />
              <DeleteAvatarButton />
            </>
          ) : (
            <div className={styles.avatarFallback}>
              {profile.full_name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
      </div>

      <AvatarUploadForm />
      <ProfileNameForm defaultName={profile?.full_name ?? ""} />
      <RentalReceiptEditor />
    </div>
  );
}
