/* eslint-disable no-unused-vars */
import { txtSlicer } from "../../utils/functionality"; // Ensure txtSlicer is exported from functionality.js
import Image from "../ui/Image"; // Ensure Image is exported from Image.jsx
import Button from "../ui/Button"; // Ensure Button is exported from Button.jsx
import axios from "axios"; // Ensure axios is installed via npm

const ProductCard = ({
  product,
  setProductToEdit,
  setIsEdit,
  openEditModal,
  setProductToEditIdx,
  idx,
  setProducts,
  products,
}) => {
  const {
    id,
    vendorId,
    vendorName,
    title,
    description,
    category,
    price,
    imageUrl,
    numOfUnits,
    numOfViews,
  } = product;

  const onEdit = () => {
    setProductToEdit(product);
    setIsEdit(true);
    openEditModal();
    setProductToEditIdx(idx);
  };

  const deleteProductHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5029/api/Vendor/deleteproduct/${product.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((prod) => prod.id !== product.id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="p-4 border rounded-lg flex flex-col items-center shadow-md">
      <Image
        className="w-full h-48 object-cover rounded-md"
        imgSrc={imageUrl}
        alt={title}
      />
      <h2 className="text-lg font-bold mt-3">{txtSlicer(title, 25)}</h2>
      <p className="text-gray-600 mt-1">{txtSlicer(description, 100)}</p>
      <div className="flex flex-col items-start mt-3">
        <span className="text-indigo-600 font-semibold">${price}</span>
        <span className="text-indigo-600">Category: {category}</span>
        <span className="text-indigo-600">numOfUnits: {numOfUnits}</span>
        <span className="text-indigo-600">Views: {numOfViews}</span>
      </div>
      <div className="flex space-x-2 mt-5">
        <Button onClick={onEdit} className="bg-violet-700">
          Edit
        </Button>
        <Button onClick={deleteProductHandler} className="bg-red-600">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;


// import { txtSlicer } from "../utils/functionality";
// import Image from "./Image";
// import Button from "./ui/Button";
// import axios from "axios";

// const ProductCard = ({ product, setProductToEdit, setIsEdit, openEditModal, setProductToEditIdx, idx, setProducts, products }) => {
//   const { id, vendorId, vendorName, title, description, category, price, imageUrl, numOfUnits, numOfViews } = product;

//   const onEdit = () => {
//     setProductToEdit(product);
//     setIsEdit(true);
//     openEditModal();
//     setProductToEditIdx(idx);
//   };

//   const deleteProductHandler = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5029/api/Vendor/deleteproduct/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProducts(products.filter((prod) => prod.id !== id));
//       alert("Product deleted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete product.");
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg flex flex-col items-center shadow-md">
//       <Image className="w-full h-48 object-cover rounded-md" src={imageUrl} alt={title} />
//       <h2 className="text-lg font-bold mt-3">{txtSlicer(title, 25)}</h2>
//       <p className="text-gray-600 mt-1">{txtSlicer(description, 100)}</p>
//       <div className="flex flex-col items-start mt-3">
//         <span className="text-indigo-600 font-semibold">${price}</span>
//         <span className="text-indigo-600">Category: {category}</span>
//         <span className="text-indigo-600">Units: {numOfUnits}</span>
//         <span className="text-indigo-600">Views: {numOfViews}</span>
//       </div>
//       <div className="flex space-x-2 mt-5">
//         <Button onClick={onEdit} className="bg-violet-700">
//           Edit
//         </Button>
//         <Button onClick={deleteProductHandler} className="bg-red-600">
//           Delete
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
