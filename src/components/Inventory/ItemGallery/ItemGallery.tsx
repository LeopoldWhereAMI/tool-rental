import { toast } from "sonner";
import ImageUploader from "@/components/ui/ImageUploader/ImageUploader";
import { updateInventoryImage } from "@/services/inventoryService";

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
      await updateInventoryImage(id, newUrl);
      await onMutate();

      toast.success("Фото инструмента обновлено");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка БД";
      toast.error("Не удалось обновить ссылку: " + msg);
    }
  };

  return (
    <section>
      <ImageUploader
        inventoryId={id}
        currentImageUrl={imageUrl}
        onUploadSuccess={handleImageUpdate}
      />
    </section>
  );
}
