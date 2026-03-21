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
          <h1 className={styles.title}>Карточка пользователя</h1>
          <span className={styles.subTitle}>
            Просмотр и управление данными аккаунта.
          </span>
        </div>
      </div>

      {/* Измененная структура контента */}
      <div className={styles.contentWrapper}>
        {/* ЛЕВАЯ ЧАСТЬ: Акт аренды (занимает больше места) */}
        <div className={`${styles.card} ${styles.receiptSection}`}>
          <h2 className={styles.cardTitle}>Создание акта аренды</h2>
          <RentalReceiptEditor />
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Настройки профиля (занимает меньше места) */}
        <section className={styles.profileSection}>
          <div className={`${styles.card} ${styles.avatarCard}`}>
            <h2 className={styles.cardTitle}>Загрузить аватар</h2>
            <div className={styles.avatarWrapper}>
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
                  <DeleteAvatarButton />
                </>
              ) : (
                <div className={styles.avatarFallback}>
                  {profile.full_name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>
            <AvatarUploadForm />
          </div>
          <div className={`${styles.card} ${styles.nameCard}`}>
            <h2 className={styles.cardTitle}>Редактирование имени</h2>
            <ProfileNameForm defaultName={profile?.full_name ?? ""} />
          </div>
        </section>
      </div>
    </div>
  );
}
