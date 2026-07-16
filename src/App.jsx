import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Support from "./pages/Support";
import MyStore from "./pages/MyStore";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import Privacy from "./pages/Privacy";
import Product from "./pages/Product";
import Event from "./pages/Event";
import Camping from "./pages/Camping";
import Cycling from "./pages/Cycling";
import Climbing from "./pages/Climbing";
import Fitness from "./pages/Fitness";
import OutdoorSkills from "./pages/OutdoorSkills";
import Snowsports from "./pages/Snowsports";
import Stewardship from "./pages/Stewardship";
import Travel from "./pages/Travel";
import Watersports from "./pages/Watersports";
import Terms from "./pages/Terms";
import ReturnsPage from "./pages/ReturnsPage";
import Returnpolicy from "./pages/Returnpolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Rental from "./pages/Rental";
import EventDetail from "./pages/EventDetail";
import RentalProduct from "./pages/RentalProduct";
import CookiePolicy from "./pages/CookiePolicy";
import RentalBookingForm from "./pages/RentalBookingForm";
import CategoryProducts from "./pages/CategoryProducts";
import OrderDetails from "./pages/OrderDetails";
import EventRegister from "./pages/EventRegister";
import EventStep2 from "./pages/EventStep2";
import EventStep3 from "./pages/EventStep3";
import EventStep4 from "./pages/EventStep4";
import EventSuccess from "./pages/EventSuccess";
import Checkout from "./pages/Checkout";
import CustomerAccount from "./pages/CustomerAccount";
import OrderHistory from "./pages/OrderHistory";
import SavedAddresses from "./pages/SavedAddresses";
import WalletLoyalty from "./pages/WalletLoyalty";
import OffersCoupons from "./pages/OffersCoupons";
import ReturnRequestDetail from "./pages/ReturnRequestDetail";
import StorePickup from "./pages/StorePickup";
import AdminRouter from "../admin/AdminRouter";
import Compare from "./pages/Compare";

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const params = new URLSearchParams(window.location.search);
    if (!params.has("scrollTarget")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/support" element={<Support />} />
      <Route path="/store" element={<MyStore />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="/product/:id" element={<Product />} />

      <Route path="/event" element={<Event />} />
      <Route path="/event/:id" element={<EventDetail />} />

      <Route path="/events/camping" element={<Camping />} />
      <Route path="/events/climbing" element={<Climbing />} />
      <Route path="/events/cycling" element={<Cycling />} />
      <Route path="/events/fitness" element={<Fitness />} />
      <Route path="/events/outdoor-skills" element={<OutdoorSkills />} />
      <Route path="/events/snowsports" element={<Snowsports />} />
      <Route path="/events/stewardship" element={<Stewardship />} />
      <Route path="/events/travel" element={<Travel />} />
      <Route path="/events/watersports" element={<Watersports />} />

      <Route path="/return-policy" element={<Returnpolicy />} />
      <Route path="/returns-form" element={<ReturnsPage />} />
      <Route path="/shipping" element={<ShippingPolicy />} />
      <Route path="/rental" element={<Rental />} />
      <Route path="/rental-product/:id" element={<RentalProduct />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/rental-booking" element={<RentalBookingForm />} />
      <Route path="/category/:id" element={<CategoryProducts />} />
      <Route path="/order-details" element={<OrderDetails />} />
      <Route path="/event-register/:id" element={<EventRegister />} />
      <Route path="/event-step-2/:id" element={<EventStep2 />} />
      <Route path="/event-step-3/:id" element={<EventStep3 />} />
      <Route path="/event-step-4/:id" element={<EventStep4 />} />
      <Route path="/event-success/:id" element={<EventSuccess />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<CustomerAccount />} />
      <Route path="/account/orders" element={<OrderHistory />} />
      <Route path="/account/addresses" element={<SavedAddresses />} />
      <Route path="/account/wallet" element={<WalletLoyalty />} />
      <Route path="/offers" element={<OffersCoupons />} />
      <Route path="/return-request/:id" element={<ReturnRequestDetail />} />
      <Route path="/store-pickup" element={<StorePickup />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};

export default App;
