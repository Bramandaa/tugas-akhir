"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { editUserProfile } from "@/actions/profile";
import { InputField } from "@/components/inputField";

export function ProfileContent({ userData }) {
  const initialState = {
    success: false,
    message: "",
  };
  const [state, action, isPending] = useActionState(
    editUserProfile,
    initialState
  );

  return (
    <>
      <Card className="rounded-2xl shadow-md border border-gray-200">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-semibold">
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-2 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-primary/20">
              <AvatarImage src={userData?.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-lg text-gray-800">
                {userData.name}
              </div>
              <div className="text-sm text-gray-500">
                {userData.email || "Belum mengisi email"}
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Phone size={16} className="text-primary" />
                <span className="text-gray-700">{userData.phone}</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-xl flex items-center gap-1 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Edit Profil</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" action={action}>
                  <InputField
                    id="name"
                    label="Nama"
                    placeholder="Masukkan nama lengkap"
                    defaultValue={state.inputs?.name ?? userData?.name ?? ""}
                    required
                    autoComplete="name"
                    error={state.errors?.name}
                  />
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Masukkan Email"
                    defaultValue={state.inputs?.email ?? userData?.email ?? ""}
                    autoComplete="email"
                    error={state.errors?.email}
                  />
                  <InputField
                    id="phone"
                    label="Nomor HP"
                    placeholder="Masukkan nomor HP"
                    defaultValue={state.inputs?.phone ?? userData?.phone ?? ""}
                    required
                    autoComplete="tel"
                    error={state.errors?.phone}
                  />
                  <DialogFooter>
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="bg-primary text-white"
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
