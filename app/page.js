"use client";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setproducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  // 🟢 Fetch products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setproducts(rjson.allProducts || []);
    };
    fetchProducts();
  }, []);

  // ➕ Add a new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added successfully");
        setAlert("Your Product has been added!");
        setProductForm({});
      } else {
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✏️ Handle form field changes
  const handleChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  // 🔍 Handle dropdown search and show matched results
  const onDropdownEdit = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!loading) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + encodeURIComponent(value));
      const rjson = await response.json();
      setDropdown(rjson.allProducts || []);
      setLoading(false);
    }
  };

  // 🔄 Handle plus/minus actions and update quantity in DB
  const buttonAction = async (action, name, initialQuantity) => {
    setLoadingAction(true);
    const response = await fetch("/api/update/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, name, initialQuantity }),
    });

    let r = await response.json();
    setLoadingAction(false);

    // Refresh results for same search term
    if (searchQuery.trim()) {
      const refresh = await fetch("/api/search?query=" + encodeURIComponent(searchQuery));
      const refreshedJson = await refresh.json();
      setDropdown(refreshedJson.allProducts || []);
    }
  };

  return (
    <>
      <Header />

      {/* 🔍 Search Product Section */}
      <div className="container mx-auto my-6 relative">
        <div className="text-green-800 text-center">{alert}</div>
        <h2 className="text-3xl font-semibold mb-3">Search a Product</h2>

        <div className="flex mb-2">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onDropdownEdit(e);
            }}
            type="text"
            placeholder=" Enter a product name"
            className="flex-1 border border-gray-300 bg-white px-4 py-2 rounded-md"
          />
        </div>

        {(dropdown.length > 0 || loading) && (
          <div className="dropcontainer w-[85vw] border-1 bg-green-300 rounded-md">
            {loading && (
              <div className="flex justify-center items-center py-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-16 h-16">
                  <circle fill="#22c55e" stroke="#22c55e" strokeWidth="15" r="15" cx="40" cy="65">
                    <animate attributeName="cy" calcMode="spline" dur="2s" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4s" />
                  </circle>
                  <circle fill="#22c55e" stroke="#22c55e" strokeWidth="15" r="15" cx="100" cy="65">
                    <animate attributeName="cy" calcMode="spline" dur="2s" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2s" />
                  </circle>
                  <circle fill="#22c55e" stroke="#22c55e" strokeWidth="15" r="15" cx="160" cy="65">
                    <animate attributeName="cy" calcMode="spline" dur="2s" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0s" />
                  </circle>
                </svg>
              </div>
            )}

            {dropdown.map((item) => (
              <div key={item.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 p-3 my-1">
                <span className="font-semibold truncate">{item.name} (${item.price} per item)</span>
                <button onClick={() => buttonAction("minus", item.name, item.quantity)} disabled={loadingAction} className="py-1 px-4 bg-green-600 text-white rounded-xl font-semibold disabled:bg-orange-200">-</button>
                <span className="w-28 text-right"><b>Quantity: {String(item.quantity)}</b></span>
                <button onClick={() => buttonAction("plus", item.name, item.quantity)} disabled={loadingAction} className="py-1 px-4 bg-green-600 text-white rounded-xl font-semibold disabled:bg-orange-200">+</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ➕ Add Product Form */}
      <div className="container mx-auto mt-10">
        <h2 className="text-3xl font-semibold">Add Product to Database</h2>
        <span className="text-sm text-gray-500">Name, Quantity, and Price only</span>

        <form className="space-y-4 p-4 rounded-xl border bg-white mt-3">
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm mb-1">Product Name</label>
            <input value={productForm?.name || ""} name="name" type="text" id="productName" onChange={handleChange} className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-green-300" placeholder="e.g., T-Shirt (Black)" />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm mb-1">Quantity</label>
            <input value={productForm?.quantity || ""} name="quantity" type="number" id="quantity" onChange={handleChange} className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-green-300" placeholder="e.g., 10" />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm mb-1">Price($)</label>
            <input value={productForm?.price || ""} name="price" type="number" id="price" onChange={handleChange} className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-green-300" placeholder="e.g., 12.50" />
          </div>

          <button onClick={addProduct} type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-md">Add Product</button>
        </form>
      </div>

      {/* 📦 Display Stock Table */}
      <div className="container my-10 mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Current Stock</h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="max-h-[60vh] overflow-auto"></div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Price</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((product) => (
                <tr key={product.name} className="odd:bg-white even:bg-gray-50 hover:bg-green-100">
                  <td className="px-6 py-3 text-gray-900">{product.name}</td>
                  <td className="px-6 py-3 text-gray-900">{product.quantity}</td>
                  <td className="px-6 py-3 text-gray-900">${product.price}</td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-50 border-t-1">
              <tr>
                <td className="px-6 py-3 text-sm text-black-700"><b>Total items</b></td>
                <td className="px-6 py-3 text-right font-mono"><b>{products.reduce((sum, p) => sum + Number(p.quantity || 0), 0)}</b></td>
                <td className="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}
