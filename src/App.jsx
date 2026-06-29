import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout   from "./layouts/MainLayout";
import AuthLayout   from "./layouts/AuthLayout";
import GuestLayout  from "./guest/layouts/GuestLayout";
import Dashboard    from "./pages/Dashboard";
import Customers    from "./pages/Customers";
import Orders       from "./pages/Orders";
import OrderDetail  from "./pages/OrderDetail";
import Products     from "./pages/Products";
import Produk       from "./pages/Produk";
import Inventory    from "./pages/Inventory";
import Membership   from "./pages/Membership";
import ErrorPage    from "./pages/ErrorPage";
import Login        from "./pages/auth/Login";
import Loading      from "./components/Loading";
import Components   from "./pages/Components";
import FiturXYZ     from "./pages/main/FiturXyz";
import Note         from "./pages/main/Note";
import StoreFront        from "./guest/pages/StoreFront";
import StoreProducts     from "./guest/pages/StoreProducts";
import StoreMembership   from "./guest/pages/StoreMembership";
import StoreOrders       from "./guest/pages/StoreOrders";
import StoreTransactions from "./guest/pages/StoreTransactions";
import StoreProfile      from "./guest/pages/StoreProfile";
import GuestLogin        from "./guest/pages/GuestLogin";

const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));

export default function App() {
  return (
    <Routes>
      {/* ── Guest / Store Routes — tanpa sidebar admin ── */}
      <Route element={<GuestLayout />}>
        <Route path="/store"               element={<StoreFront />} />
        <Route path="/store/products"      element={<StoreProducts />} />
        <Route path="/store/offers"        element={<StoreProducts />} />
        <Route path="/store/category/:cat" element={<StoreProducts />} />
        <Route path="/store/membership"    element={<StoreMembership />} />
        <Route path="/store/orders"        element={<StoreOrders />} />
        <Route path="/store/transactions"  element={<StoreTransactions />} />
        <Route path="/store/profile"       element={<StoreProfile />} />
      </Route>

      {/* Guest Login — full page, tanpa navbar store maupun sidebar admin */}
      <Route path="/store/login" element={<GuestLogin />} />

      {/* ── Auth Routes ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ── Admin Routes — dengan Sidebar & Header ── */}
      <Route element={<MainLayout />}>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/orders"     element={<Orders />} />
        <Route path="/orders/:id"  element={<OrderDetail />} />
        <Route path="/customers"  element={<Customers />} />
        <Route path="/products"   element={<Products />} />
        <Route path="/inventory"  element={<Inventory />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/fitur-xyz"  element={<FiturXYZ />} />
        <Route path="/notes"      element={<Note />} />
        <Route path="/products/:id" element={
          <Suspense fallback={<Loading />}>
            <ProductDetail />
          </Suspense>
        } />
        <Route path="/produk"     element={<Produk />} />
        <Route path="/components" element={<Components />} />
        <Route path="/error-400"  element={<ErrorPage code="400" title="Bad Request"    description="Permintaan tidak dapat diproses oleh server." image="https://illustrations.popsy.co/gray/falling.svg" />} />
        <Route path="/error-401"  element={<ErrorPage code="401" title="Unauthorized"   description="Anda harus login terlebih dahulu."            image="https://illustrations.popsy.co/gray/shaking-hands.svg" />} />
        <Route path="/error-403"  element={<ErrorPage code="403" title="Forbidden"      description="Anda tidak memiliki akses ke halaman ini."    image="https://illustrations.popsy.co/gray/stop.svg" />} />
        <Route path="*"           element={<ErrorPage code="404" title="Page Not Found" description="Halaman yang anda cari raib entah kemana." />} />
      </Route>
    </Routes>
  );
}