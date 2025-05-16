const productValidation = ({ title, description, imageUrl, price, numOfUnits, category}) => {
  const errors = {
    title: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
    numOfUnits: "",
  };
  const validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(imageUrl);


  if (!title.trim() || title.length < 10 || title.length > 28) {
    errors.title = "Product title must be between 10 and 27 characters";
  }
  if (!description.trim() || description.length < 10 || description.length > 70) {
    errors.description = "Product description must be between 30 and 50 characters";
  }
  if (category === "Select Category") {
    errors.category = "Please select a category!";
  }
  if (!imageUrl.trim() || !validUrl) {
    errors.imageUrl = "Invalid Image URL!";
  }
  if (!price.trim() || isNaN(Number(price))) {
    errors.price = "Invalid Price Input!";
  }
  if (!numOfUnits.trim() || isNaN(Number(numOfUnits))) {
    errors.price = "Invalid Units Input!";
  }
  return errors; 
};
export default productValidation;

