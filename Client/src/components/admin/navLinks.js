export const navItems = ({ id }) => [
  { label: "Dashboard", path: `/admin/${id}` },
  { label: "Users", path: `/admin/users/${id}` },
  { label: "Products", path: `/admin/products/${id}` },
  { label: "Post Requests", path: `/admin/post-request/${id}` },
  { label: "Register Requests", path: `/admin/register-requests/${id}` },
  { label: "Logout", path: "/login" },
];
