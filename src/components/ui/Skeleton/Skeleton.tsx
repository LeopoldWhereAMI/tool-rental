import styles from "./Skeleton.module.css";

export default function Skeleton({
  width,
  height,
  borderRadius = "4px",
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}) {
  return (
    <div className={styles.skeleton} style={{ width, height, borderRadius }} />
  );
}
