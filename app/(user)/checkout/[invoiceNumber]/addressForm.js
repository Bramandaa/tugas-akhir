import { CheckCircle2, ChevronDown, Edit3, Phone, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { editAdressCheckout } from "@/actions/profile";
import { InputField } from "@/components/inputField";
import Spinner from "@/components/spinner";

export default function AddressForm({ order, address }) {
  const initialState = { success: false, message: "" };
  const [state, action, isPending] = useActionState(
    editAdressCheckout,
    initialState
  );

  const [open, setOpen] = useState(false);

  const [provinsi, setProvinsi] = useState(
    state?.inputs?.provinsi ?? address?.provinsi ?? ""
  );
  const [kabupaten, setKabupaten] = useState(
    state?.inputs?.kabupaten ?? address?.kabupaten ?? ""
  );
  const [kecamatan, setKecamatan] = useState(
    state?.inputs?.kecamatan ?? address?.kecamatan ?? ""
  );

  const kecamatanOptions = [
    "Kuta Selatan",
    "Kuta",
    "Kuta Utara",
    "Mengwi",
    "Abiansemal",
    "Petang",
  ];

  useEffect(() => {
    if (state?.success) {
      setOpen(!open);
    }
  }, [state?.success, state?.timestamp]);

  return (
    <div className="flex-1 space-y-4">
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Alamat Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="font-medium">{address.name}</div>
              <div className="capitalize">
                {address.fullAddress},{" "}
                <div>
                  {address.kecamatan},{" " + address.kabupaten},
                  {" " + address.provinsi}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={12} className="text-primary" />
                <span>{address.phone}</span>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl flex items-center gap-1 border-primary text-primary hover:text-white hover:bg-primary cursor-pointer"
                >
                  Ubah alamat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Ubah Alamat</DialogTitle>
                </DialogHeader>

                <form className="space-y-5" action={action}>
                  <InputField
                    id="fullAddress"
                    label="Alamat Lengkap"
                    placeholder="Masukkan alamat lengkap"
                    defaultValue={
                      state?.inputs?.fullAddress ?? address.fullAddress ?? ""
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
                          <SelectItem
                            className="capitalize"
                            key={kec}
                            value={kec}
                          >
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
