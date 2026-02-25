import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  extra?: React.ReactNode; // Для статусов, бейджей и т.д.
  className?: string;
}

export default function Breadcrumbs({
  items,
  extra,
  className,
}: BreadcrumbsProps) {
  return (
    <nav className={`${styles.breadcrumbs} ${className || ""}`}>
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}

              {!isLast && (
                <ChevronRight size={14} className={styles.separator} />
              )}
            </li>
          );
        })}
      </ul>

      {extra && <div className={styles.extra}>{extra}</div>}
    </nav>
  );
}
