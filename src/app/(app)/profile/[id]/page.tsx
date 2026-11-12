import { redirect } from "next/navigation";
import { getProfile } from "@/services/profileService";
import ProfileNameForm from "./components/ProfileNameForm/ProfileNameForm";
import RentalReceiptEditor from "@/components/Print/RentalReceipt/RentalReceiptEditor/RentalReceiptEditor";
import AvatarUploader from "./components/AvatarUploader/AvatarUploader";
import { auth } from "../../../../auth";
import styles from "./page.module.css";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getProfile(session.user.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Карточка пользователя</h1>
          <span className={styles.subTitle}>
            Просмотр и управление данными аккаунта.
          </span>
        </div>
        <AvatarUploader profile={profile} />
      </div>

      <div className={styles.contentWrapper}>
        <RentalReceiptEditor />

        <section className={styles.profileSection}>
          <div className={`${styles.card} ${styles.nameCard}`}>
            <h2 className={styles.cardTitle}>Редактирование имени</h2>
            <ProfileNameForm defaultName={profile?.fullName ?? ""} />
          </div>
        </section>
      </div>
    </div>
  );
}
