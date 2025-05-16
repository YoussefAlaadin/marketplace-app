import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/customer/ProductCard';
import HeaderBottom from '../../components/header/HeaderBottom';
import Header from '../../components/header/Header';
import axios from 'axios';
import Footer from '../../components/Footer/Footer';
import FooterBottom from '../../components/Footer/FooterBottom';

function Shop() {
  const [allProducts, setAllProducts] = useState([]);  //EDIT THIS
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5029/api/Customer/Products", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
          setFilteredProducts(res.data);
          // استخرج أعلى سعر
          const prices = res.data.map(p => p.price);
          setMaxPrice(Math.max(...prices));
        } else {
          setAllProducts([]);
          setFilteredProducts([]);
        }

      } catch (err) {
        setAllProducts([]);
        setFilteredProducts([]);
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  // فلترة المنتجات حسب السعر والصنف
  const filterProducts = () => {
    let filtered = allProducts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product => product.price <= maxPrice);

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, maxPrice]);

  // استخراج الأصناف بدون تكرار
  const categories = ["All", ...new Set(allProducts.map(p => p.category))];

  return (
    <>
      <Header />
      <HeaderBottom />

      <main className="p-5">
        {/* الفلاتر */}
        <div className="mb-5 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-100 p-4 rounded-md">
          <div>
            <label className="font-medium">Category: </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="ml-2 p-1 rounded border"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium ">Max Price: </label>
            <input
              type="range"
              min="20"
              max={Math.max(...allProducts.map(p => p.price), 1000)}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="ml"
            />
            <span className="ml-2 font-semibold text-black">${maxPrice}</span>
          </div>
        </div>

        {/* عرض المنتجات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.length > 0 ? (       //CHANGE THIS TO FILTERPRODUCTS
            filteredProducts.map(product => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <div className="text-center col-span-full">
              <h2 className="text-2xl font-bold text-gray-700">No products available</h2>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FooterBottom />
    </>
  );
}

export default Shop;
