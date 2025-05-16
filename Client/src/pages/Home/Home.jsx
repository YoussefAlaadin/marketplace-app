import React from "react";
import Banner from "../../components/Banner/Banner";
import BannerBottom from "../../components/Banner/BannerBottom";
//import BestSellers from "../../components/home/BestSellers/BestSellers";
// import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
// import Sale from "../../components/home/Sale/Sale";
// import SpecialOffers from "../../components/home/SpecialOffers/SpecialOffers";
import YearProduct from "../../components/home/YearProduct/YearProduct";
import Header from "../../components/header/Header";
import HeaderBottom from "../../components/header/HeaderBottom";
import Footer from "../../components/Footer/Footer";
import FooterBottom from "../../components/Footer/FooterBottom";

const Home = () => {
  const userId = localStorage.getItem("userId");

  return (
    <>
      <Header />
      <HeaderBottom userId={userId} />
      <div className="w-full mx-auto">
        <Banner userId={userId} />
        <BannerBottom />
        <div className="max-w-container mx-auto px-4">
          <YearProduct />
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </>
  );
};

export default Home;
