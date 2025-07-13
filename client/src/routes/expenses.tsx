import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/expenses")({
  component: RouteComponent,
});

async function getExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const { data } = await res.json();
  return data;
}

function RouteComponent() {
  const {
    isLoading,
    isError,
    data: expenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading expenses</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense: any) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>${expense.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
