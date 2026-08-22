import { redirect } from "next/navigation";

// /products is deprecated — redirect to /lighting which is the new products page
export default function ProductsPage() {
  redirect("/lighting");
}
