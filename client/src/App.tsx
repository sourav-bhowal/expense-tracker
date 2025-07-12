import { useEffect, useState } from "react";
import ExpenseCard from "./components/shared/TotalExpenseCard";
import { type ApiRoutes } from "../../server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

function App() {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const response = await client.api.expenses["total"].get();
        console.log("Response from server:", response);
        if (response.ok) {
          const data = await response.json();
          setTotalExpenses(data.total);
        } else {
          console.error("Failed to fetch total expenses", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching total expenses:", error);
      }
    };

    fetchTotalExpenses();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <ExpenseCard expenses={totalExpenses} />
    </main>
  );
}

export default App;
