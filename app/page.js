import Banner from "@/components/banner";
import EmptyPage from "@/components/EmptyPage";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getBanners } from "@/lib/data-access/banner";
import { getCartByUser } from "@/lib/data-access/cart";
import {
  getActiveProducts,
  getFeaturedProducts,
  getProducstWithCondition,
} from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.search || "";

  let SearchProducts = [];
  let products = [];
  let featuredProducts = [];

  if (keyword) {
    const where = { name: { contains: keyword, mode: "insensitive" } };
    SearchProducts = await getProducstWithCondition(where);
  } else {
    [products, featuredProducts] = await Promise.all([
      getActiveProducts(),
      getFeaturedProducts(),
    ]);
  }

  const [banners, session] = await Promise.all([getBanners(), getSession()]);
  const cartData = session?.userId
    ? await getCartByUser(session.userId, { tags: ["cart"] })
    : [];

  if (
    SearchProducts.length === 0 &&
    SearchProducts.length === 0 &&
    featuredProducts.length === 0
  ) {
    return (
      <>
        <Navigation session={session} cartData={cartData?.items} />
        <EmptyPage
          message={
            "Produk belum tersedia atau tidak ditemukan. Silakan cek kembali nanti."
          }
          buttonMessage={"Kembali ke beranda"}
          href={"/"}
        >
          <div className="p-6 rounded-full shadow-md">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-primary">
            Belum ada produk
          </h2>
        </EmptyPage>
      </>
    );
  }

  return (
    <>
      <Navigation session={session} cartData={cartData?.items} />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12">
        {(!SearchProducts || SearchProducts.length === 0) && (
          <Banner banners={banners} />
        )}
        {featuredProducts && featuredProducts.length !== 0 && (
          <>
            <div className="space-y-2">
              <h2 className="font-semibold text-lg sm:text-xl text-primary">
                Produk Unggulan
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {featuredProducts.map((item) => (
                  <Link key={item.id} href={"/product/" + item.slug}>
                    <Card
                      key={item.id}
                      className="w-full aspect-[4/6] shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <CardContent className="p-2 flex flex-col h-full">
                        <div className="relative w-full aspect-square flex items-center justify-center">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            sizes="100vh"
                            fill
                            priority
                            className="object-contain"
                          />
                        </div>
                        <div className="mt-2 space-y-1 flex-1">
                          {/* ubah jadi truncate */}
                          <p className="text-sm truncate text-primary">
                            {item.name}
                          </p>
                          <p className="text-sm font-bold text-primary">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
        {products && products.length !== 0 && (
          <>
            <div className="w-full h-0.5 bg-gray-200" />
            <div className="space-y-2">
              <h2 className="font-semibold text-lg sm:text-xl text-primary">
                Produk Baru
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {products.map((item) => (
                  <Link key={item.id} href={"/product/" + item.slug}>
                    <Card
                      key={item.id}
                      className="w-full shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <CardContent className="p-2 flex flex-col h-full">
                        <div className="relative w-full aspect-square flex items-center justify-center">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            sizes="100vh"
                            fill
                            priority
                            className="object-contain"
                          />
                        </div>
                        <div className="mt-2 space-y-0.5 flex-1">
                          <p className="text-sm truncate text-primary">
                            {item.name}
                          </p>
                          <p className="text-sm font-bold text-primary">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                          {/* <p className="text-sm text-gray-400">200 terjual</p> */}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
        {SearchProducts && SearchProducts.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-semibold text-lg sm:text-sm text-primary">
              Menampilkan {SearchProducts.length} produk untuk{" "}
              {searchParams.search}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {SearchProducts.map((item) => (
                <Link key={item.id} href={"/product/" + item.slug}>
                  <Card
                    key={item.id}
                    className="w-full aspect-[4/6] shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <CardContent className="p-2 flex flex-col h-full">
                      <div className="relative w-full aspect-square flex items-center justify-center">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          sizes="100vh"
                          fill
                          priority
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2 space-y-1 flex-1">
                        {/* ubah jadi truncate */}
                        <p className="text-sm truncate text-primary">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
