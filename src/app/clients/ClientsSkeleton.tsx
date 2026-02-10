import Skeleton from "@/components/ui/Skeleton/Skeleton";

export default function ClientsSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i}>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Skeleton width="24px" height="24px" borderRadius="50%" />
              <Skeleton width="150px" height="20px" />
            </div>
          </td>
          <td>
            <Skeleton width="120px" height="20px" />
          </td>
          <td>
            <Skeleton width="100px" height="20px" />
          </td>
          <td>
            <Skeleton width="30px" height="30px" />
          </td>
        </tr>
      ))}
    </>
  );
}
