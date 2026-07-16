import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyStore = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>My Store</h1>
        <p>Select your nearest store and check store availability.</p>
      </div>
      <Footer />
    </>
  );
};

export default MyStore;