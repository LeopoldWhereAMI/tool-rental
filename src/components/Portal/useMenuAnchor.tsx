import { useState, useCallback } from "react";

export const useMenuAnchor = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );

  const toggleMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: string) => {
      e.stopPropagation();

      if (openMenuId === id) {
        setOpenMenuId(null);
        setAnchor(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setAnchor({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setOpenMenuId(id);
      }
    },
    [openMenuId],
  );

  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
    setAnchor(null);
  }, []);

  return { openMenuId, anchor, toggleMenu, closeMenu };
};
