//const id = localStorage.getItem("userId");
export const vendNavLinks = ({ id }) => [
  { label: "Dashboard", path: `/vendor/${id}` },
  { label: "Product Management", path: `/vendor/product-manage/${id}` },
  { label: "Loyal Customers", path: `/vendor/purchase-history/${id}` },
  //{ label: "Post Requests", path: `/vendor/post-request/${id}` },
 // { label: "Register Requests", path: `/vendor/register-requests/${id}` },
  { label: "Logout", path: "/login" },
];
