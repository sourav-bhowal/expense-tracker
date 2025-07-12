import ExpenseCard from "./components/shared/TotalExpenseCard";
import { api } from "./lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchExpenses() {
  const response = await api.expenses["total"].$get();
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const { total } = await response.json();
  return total;
}

function App() {
  const {
    data: totalExpenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["totalExpenses"],
    queryFn: fetchExpenses,
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <ExpenseCard expenses={totalExpenses} />
    </main>
  );
}

export default App;
