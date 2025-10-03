import Banner from "@/components/banner";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getBanners } from "@/lib/data-access/banner";
import {
  getActiveProducts,
  getFeaturedProducts,
} from "@/lib/data-access/product";
import { getSession } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const [products, featuredProducts, banners, session] = await Promise.all([
    getActiveProducts(),
    getFeaturedProducts(),
    getBanners(),
    getSession(),
  ]);
  return (
    <>
      <Navigation session={session} />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-12">
        <Banner banners={banners} />
        <div className="space-y-2">
          <h2 className="font-semibold text-lg sm:text-xl text-primary">
            Produk Baru
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((item) => (
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

        <div className="w-full h-0.5 bg-gray-200" />

        {/* Terlaris */}
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
                        {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
