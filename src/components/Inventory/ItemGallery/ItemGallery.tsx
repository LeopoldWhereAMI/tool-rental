import { supabase } from "@/lib/supabase";
// import styles from "./ItemGallery.module.css";
import { toast } from "sonner";
import ImageUploader from "@/components/ui/ImageUploader/ImageUploader";

type ItemGalleryProps = {
  id: string;
  imageUrl?: string | null;
  onMutate: () => Promise<unknown>;
};

export default function ItemGallery({
  id,
  imageUrl,
  onMutate,
}: ItemGalleryProps) {
  const handleImageUpdate = async (newUrl: string) => {
    try {
      const { error } = await supabase
        .from("inventory")
        .update({ image_url: newUrl })
        .eq("id", id);

      if (error) throw error;
      await onMutate();

      toast.success("Фото инструмента обновлено");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка БД";
      toast.error("Не удалось обновить ссылку: " + msg);
    }
  };

  return (
    <section>
      <h2>Галерея</h2>

      <ImageUploader
        currentImageUrl={imageUrl}
        onUploadSuccess={handleImageUpdate}
      />
      {!imageUrl && <p>Изображение отсутствует</p>}
    </section>
  );
}
