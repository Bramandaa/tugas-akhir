import { getSession } from "@/lib/session";
import { getCartByUser } from "@/lib/data-access/cart";
import Navigation from "@/components/navigation";

export default async function UserLayout({ children }) {
  const session = await getSession();

  const cartData = session?.userId ? await getCartByUser(session.userId) : null;

  return (
    <>
      <Navigation session={session} cartData={cartData?.items} />
      <>{children}</>
    </>
  );
}
