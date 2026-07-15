import { CustomersManager } from "@/components/dashboard/customers/CustomersManager";
import { fetchCustomers } from "@/lib/api/customers";

export default async function DashboardCustomersPage() {
  const { items: customers } = await fetchCustomers();

  return <CustomersManager initialCustomers={customers} />;
}
