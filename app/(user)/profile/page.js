import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/data-access/user";
import { ProfileContent } from "./profileContent";
import { AddressContent } from "./addressContent";

export default async function ProfilePage() {
  const session = await getSession();
  const userData = await getUserById(session.userId);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <h1 className="font-bold text-2xl text-primary">Profil Saya</h1>
      {/* Info akun */}
      <ProfileContent userData={userData} />
      <AddressContent userData={userData} />
    </section>
  );
}
