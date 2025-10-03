"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUserAdress } from "@/actions/profile";
import { InputField } from "@/components/inputField";
import Spinner from "@/components/spinner";

export function AddressContent({ userData }) {
  const initialState = { success: false, message: "" };
  const [state, action, isPending] = useActionState(
    editUserAdress,
    initialState
  );

  const [open, setOpen] = useState(false);

  const [provinsi, setProvinsi] = useState(
    state?.inputs?.provinsi ?? userData?.provinsi ?? ""
  );
  const [kabupaten, setKabupaten] = useState(
    state?.inputs?.kabupaten ?? userData?.kabupaten ?? ""
  );
  const [kecamatan, setKecamatan] = useState(
    state?.inputs?.kecamatan ?? userData?.kecamatan ?? ""
  );

  const kecamatanOptions = [
    "Kuta Selatan",
    "Kuta",
    "Kuta Utara",
    "Mengwi",
    "Abiansemal",
    "Petang",
  ];

  const hasAddress =
    userData.fullAddress &&
    userData.provinsi &&
    userData.kabupaten &&
    userData.kecamatan;

  useEffect(() => {
    if (state?.success) {
      setOpen(!open);
    }
  }, [state?.success, state?.timestamp]);

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Alamat</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-6">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-primary mt-1" />
          <div className="capitalize">
            <p className="font-medium text-gray-800">
              {hasAddress ? userData.fullAddress : "Belum ada alamat"}
            </p>
            {hasAddress && (
              <p className="text-gray-600 text-sm">
                {userData.kecamatan}, {userData.kabupaten}, {userData.provinsi}
              </p>
            )}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-xl flex items-center gap-1 bg-primary text-white hover:bg-primary/90 cursor-pointer"
            >
              <Edit3 size={14} /> {hasAddress ? "Edit Alamat" : "Tambah Alamat"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>
                {hasAddress ? "Edit Alamat" : "Tambah Alamat"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-5" action={action}>
              <InputField
                id="fullAddress"
                label="Alamat Lengkap"
                placeholder="Masukkan alamat lengkap"
                defaultValue={
                  state?.inputs?.fullAddress ?? userData.fullAddress ?? ""
                }
                required
                autoComplete="fullAddress"
                error={state?.errors?.fullAddress}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="capitalize">Provinsi</Label>
                  <Select
                    name="provinsi"
                    value={provinsi}
                    onValueChange={setProvinsi}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bali" className="capitalize">
                        Bali
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="capitalize">Kabupaten</Label>
                  <Select
                    name="kabupaten"
                    value={kabupaten}
                    onValueChange={setKabupaten}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="badung" className="capitalize">
                        Badung
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="capitalize">Kecamatan</Label>
                <Select
                  name="kecamatan"
                  value={kecamatan}
                  onValueChange={setKecamatan}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kecamatanOptions.map((kec) => (
                      <SelectItem className="capitalize" key={kec} value={kec}>
                        {kec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-white cursor-pointer w-20"
                >
                  {isPending ? <Spinner /> : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
