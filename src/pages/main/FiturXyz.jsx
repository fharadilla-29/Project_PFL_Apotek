import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FiturXYZ() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Fitur XYZ</h1>
        <p className="text-xs text-gray-400 mt-0.5">Halaman demonstrasi komponen shadcn/ui</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Card Component</h2>
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Belajar shadcn/ui</CardTitle>
                <Badge variant="secondary">Baru</Badge>
              </div>
              <CardDescription>Contoh penggunaan komponen shadcn/ui di React</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Komponen ini dibuat di branch <strong>setup-shadcn</strong> lalu di-merge ke main.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button>Simpan</Button>
              <Button variant="outline">Batal</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Accordion Component</h2>
          <Accordion type="single" collapsible defaultValue="shipping" className="w-full max-w-xl">
            <AccordionItem value="shipping">
              <AccordionTrigger>Apa saja opsi pengiriman?</AccordionTrigger>
              <AccordionContent>
                Tersedia pengiriman standar (5–7 hari), ekspres (2–3 hari), dan overnight. Gratis ongkir untuk pesanan internasional.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Bagaimana kebijakan pengembalian?</AccordionTrigger>
              <AccordionContent>
                Pengembalian diterima dalam 30 hari. Barang harus belum digunakan dalam kemasan asli. Refund diproses dalam 5–7 hari kerja.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>Bagaimana menghubungi dukungan pelanggan?</AccordionTrigger>
              <AccordionContent>
                Hubungi kami via email, live chat, atau telepon. Kami merespons dalam 24 jam di hari kerja.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
