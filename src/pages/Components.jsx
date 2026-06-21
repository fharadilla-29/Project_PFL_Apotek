import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Card from "../components/Card";
import ProductCard from "../components/ProductCard";
import Table from "../components/Table";

export default function Components() {
       const headers = [
  "No",
  "Nama Produk",
  "Kategori",
  "Harga",
  "Aksi"
];

const products = [
  {
    id: 1,
    name: "Laptop Asus",
    category: "Elektronik",
    price: "Rp 8.000.000"
  },
  {
    id: 2,
    name: "Sepatu Sport",
    category: "Fashion",
    price: "Rp 450.000"
  },
  {
    id: 3,
    name: "Jam Tangan",
    category: "Aksesoris",
    price: "Rp 799.000"
  }
];
    return (
    <>   
     <Container className="bg-gray-200">
            <PageHeader title="Components"/>
            <Card>
            <p>Ini Halaman Components</p>
            <div className="mb-3 flex gap-2">
            <Button>Simpan</Button>
            <Button type="danger">Hapus</Button>
            <Button type="secondary">Edit</Button>
            <Button type="warning">Cetak</Button>
        </div> 
        
        <div className="mb-3 flex gap-2">
            <Badge>Aktif</Badge>
            <Badge type="success">Berhasil</Badge>
            <Badge type="warning">Kurang</Badge>
        </div>

        <div className="mb-3 flex gap-2">
            <Avatar name="Fikri" />
            <Avatar name="Surya" />
            <Avatar name="Ningsih" />
        </div>
        </Card>


          <ProductCard
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            title="Sepatu Sport"
            category="Fashion"
            price="Rp 450.000"
            description="Sepatu sport modern dengan desain nyaman dan ringan untuk aktivitas sehari-hari."
            />

            <ProductCard
             image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
            title="Smartphone"
            category="Elektronik"
            price="Rp 4.500.000"
            description="Smartphone dengan performa cepat, kamera jernih, dan baterai tahan lama."
            />

                            <Table headers={headers}>
                {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">
                        {index + 1}
                    </td>

                    <td className="border px-4 py-3">
                        {product.name}
                    </td>

                    <td className="border px-4 py-3">
                        {product.category}
                    </td>

                    <td className="border px-4 py-3">
                        {product.price}
                    </td>

                    <td className="border px-4 py-3">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded">
                        Detail
                        </button>
                    </td>
                    </tr>
                ))}
                </Table>

        {/* <Container className="bg-gray-200">
        <h1 className="text-3xl font-bold mb-4">
            Daftar Produk
        </h1>

        <p className="text-gray-600">
            Berikut adalah daftar produk terbaru.
        </p>
        </Container> */}

     </Container>
     <Footer />
     
    </>
    );
}
