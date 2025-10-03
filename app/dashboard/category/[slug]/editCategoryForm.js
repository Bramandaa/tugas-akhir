"use client";

import { useActionState, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { editCategory } from "@/actions/category";
import { InputField } from "@/components/inputField";

export default function EditCategoryForm({ category }) {
  const initialState = {
    success: false,
    message: "",
  };
  const [state, action, isPending] = useActionState(editCategory, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(state.inputs?.name ?? category?.name ?? "");
  const [slug, setSlug] = useState(state.inputs?.slug ?? category?.slug ?? "");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(generateSlug(value));
  };

  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload();
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <form action={action}>
      <div className="space-y-6">
        <div className="flex justify-between items-center h-8">
          <h2 className="text-2xl font-bold">Detail Kategori</h2>
          <div className="space-x-3">
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className={`cursor-pointer ${
                    isPending
                      ? "bg-green-300"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                >
                  {isPending ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-300 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M2.727 1.364c-.753 0-1.363.61-1.363 1.363v14.546c0 .753.61 1.363 1.363 1.363h14.546c.753 0 1.363-.61 1.363-1.363V2.727c0-.753-.61-1.363-1.363-1.363H2.727ZM17.273 0A2.727 2.727 0 0 1 20 2.727v14.546A2.727 2.727 0 0 1 17.273 20H2.727A2.727 2.727 0 0 1 0 17.273V2.727A2.727 2.727 0 0 1 2.727 0h14.546Zm-3.318 2.435a.682.682 0 0 0-.682.682V5a.682.682 0 0 0 1.364 0V3.117a.682.682 0 0 0-.682-.682ZM2.744.94l1.363.006l-.021 4.446c-.03.406.1.734.415 1.037c.313.301.744.438 1.384.4l8.625.004c.482-.055.821-.213 1.05-.469c.228-.257.346-.603.345-1.073V.942h1.364v4.347c.001.789-.227 1.46-.692 1.982c-.465.522-1.114.825-1.99.92h-8.66c-.959.059-1.765-.197-2.371-.78c-.604-.58-.89-1.304-.832-2.072l.02-4.4Z"
                        />
                      </svg>
                      Simpan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="secondary"
                  disabled={isPending}
                  aria-busy={isPending}
                  onClick={handleCancel}
                >
                  Batal
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="cursor-pointer bg-blue-600 hover:bg-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                </svg>
                Edit
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <InputField
                  id="name"
                  label="Nama Kategori"
                  placeholder="Masukkan nama kategori"
                  defaultValue={state.inputs?.name ?? category?.name ?? ""}
                  required
                  disabled={!isEditing}
                  onChange={handleNameChange}
                  autoComplete="name"
                  error={state.errors?.name}
                />
                <InputField
                  id="slug"
                  label="Nama Slug"
                  placeholder="Masukkan Slug"
                  value={slug}
                  required
                  readOnly
                  disabled={!isEditing}
                  autoComplete="slug"
                  error={state.errors?.slug}
                />
                <input type="hidden" name="oldSlug" value={category?.slug} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produk dalam Kategori ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category?.products?.length > 0 ? (
                  category.products.map((product) => (
                    <div
                      key={product?.id}
                      className="p-2 border rounded-md hover:bg-gray-50 transition"
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Harga: {formatPrice(product?.price)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    Belum ada produk dalam kategori ini.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
