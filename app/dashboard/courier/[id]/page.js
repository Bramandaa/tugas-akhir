import { getUserById } from "@/lib/data-access/user";
import EditCourierForm from "./editCourierForm";

export default async function DetailCourierPage({ params }) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  return (
    <>
      <EditCourierForm user={user} />
    </>
  );
}
