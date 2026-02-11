import styles from "./PageWrapper.module.css";
import { PageWrapperProps } from "./PageWrapper";

export default function PageContainer({ children }: PageWrapperProps) {
  return <div className={styles.pageContainer}>{children}</div>;
}
