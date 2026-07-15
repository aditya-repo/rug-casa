export const dashboardStats = [
  { label: "Revenue (30d)", value: "₹12.4L", change: "+8.2%", trend: "up" as const },
  { label: "Orders", value: "384", change: "+12%", trend: "up" as const },
  { label: "Products", value: "128", change: "+3", trend: "neutral" as const },
  { label: "Pending reviews", value: "14", change: "Needs action", trend: "warn" as const },
];

export const recentOrders = [
  { id: "RC12891", customer: "Priya Nair", total: "₹4,999", status: "processing" as const, date: "Today" },
  { id: "RC12890", customer: "Rahul Mehta", total: "₹8,499", status: "shipped" as const, date: "Today" },
  { id: "RC12888", customer: "Ananya Das", total: "₹3,299", status: "delivered" as const, date: "Yesterday" },
  { id: "RC12885", customer: "Vikram Singh", total: "₹6,199", status: "cancelled" as const, date: "Yesterday" },
];

export const dashboardCategories = [
  { id: "cat-1", name: "Living Room", slug: "living-room", products: 42, status: "active" as const },
  { id: "cat-2", name: "Bedroom", slug: "bedroom", products: 31, status: "active" as const },
  { id: "cat-3", name: "Runners", slug: "runners", products: 18, status: "active" as const },
  { id: "cat-4", name: "Outdoor", slug: "outdoor", products: 9, status: "draft" as const },
];

export const dashboardProducts = [
  { id: "tr-vintage", name: "Vintage Distressed Rug", sku: "RC-VD-58", category: "Living Room", price: "₹3,199", stock: 24, status: "published" as const },
  { id: "na-jute", name: "Jute Braided Rug", sku: "RC-JB-46", category: "Bedroom", price: "₹2,499", stock: 8, status: "published" as const },
  { id: "ep-kilim", name: "Kilim Flatweave", sku: "RC-KF-57", category: "Living Room", price: "₹3,599", stock: 0, status: "out_of_stock" as const },
  { id: "tr-floral", name: "Floral Heritage Rug", sku: "RC-FH-69", category: "Bedroom", price: "₹3,799", stock: 15, status: "draft" as const },
];

export const dashboardOrders = [
  { id: "RC12891", customer: "Priya Nair", items: 2, total: "₹4,999", payment: "Paid", status: "processing" as const, date: "Jun 25, 2026" },
  { id: "RC12890", customer: "Rahul Mehta", items: 1, total: "₹8,499", payment: "Paid", status: "shipped" as const, date: "Jun 25, 2026" },
  { id: "RC12888", customer: "Ananya Das", items: 3, total: "₹3,299", payment: "Paid", status: "delivered" as const, date: "Jun 24, 2026" },
  { id: "RC12885", customer: "Vikram Singh", items: 1, total: "₹6,199", payment: "Refunded", status: "cancelled" as const, date: "Jun 24, 2026" },
  { id: "RC12880", customer: "Meera Joshi", items: 2, total: "₹5,499", payment: "COD", status: "pending" as const, date: "Jun 23, 2026" },
];

export const dashboardCustomers = [
  { id: "cust-1", name: "Arjun Sharma", email: "arjun@example.com", orders: 6, spent: "₹28,400", joined: "Jan 2025", status: "active" as const },
  { id: "cust-2", name: "Priya Nair", email: "priya.n@example.com", orders: 3, spent: "₹12,100", joined: "Mar 2025", status: "active" as const },
  { id: "cust-3", name: "Rahul Mehta", email: "rahul.m@example.com", orders: 1, spent: "₹8,499", joined: "Jun 2026", status: "active" as const },
  { id: "cust-4", name: "Guest User", email: "guest_8821@temp.rugsbhadohi", orders: 0, spent: "₹0", joined: "Jun 2026", status: "inactive" as const },
];

export const dashboardReviews = [
  { id: "rev-1", product: "Vintage Distressed Rug", customer: "Priya Nair", rating: 5, excerpt: "Beautiful quality, colours match the photos.", status: "pending" as const, date: "Jun 25" },
  { id: "rev-2", product: "Kilim Flatweave", customer: "Ananya Das", rating: 4, excerpt: "Soft underfoot. Delivery was quick.", status: "pending" as const, date: "Jun 24" },
  { id: "rev-3", product: "Jute Braided Rug", customer: "Rahul Mehta", rating: 2, excerpt: "Edges curled after a week.", status: "pending" as const, date: "Jun 23" },
  { id: "rev-4", product: "Floral Heritage Rug", customer: "Meera Joshi", rating: 5, excerpt: "Stunning pattern. Highly recommend.", status: "approved" as const, date: "Jun 20" },
];

export const dashboardReturns = [
  { id: "ret-101", orderId: "RC12870", customer: "Ananya Das", type: "return" as const, reason: "Size mismatch", amount: "₹3,299", status: "pending" as const, date: "Jun 24" },
  { id: "ret-102", orderId: "RC12855", customer: "Vikram Singh", type: "exchange" as const, reason: "Colour preference", amount: "₹6,199", status: "approved" as const, date: "Jun 22" },
  { id: "ret-103", orderId: "RC12840", customer: "Priya Nair", type: "return" as const, reason: "Damaged in transit", amount: "₹4,999", status: "processing" as const, date: "Jun 21" },
  { id: "ret-104", orderId: "RC12812", customer: "Rahul Mehta", type: "exchange" as const, reason: "Wrong size delivered", amount: "₹8,499", status: "completed" as const, date: "Jun 18" },
];
