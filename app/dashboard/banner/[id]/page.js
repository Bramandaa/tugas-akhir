import EditBannerForm from "./editBannerForm";
import { getBanner } from "@/lib/data-access/banner";

export default async function DetailBannerPage({ params }) {
  const { id } = await params;

  const banner = await getBanner(Number(id));

  return <EditBannerForm banner={banner} />;
}
