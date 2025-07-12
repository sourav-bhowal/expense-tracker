import { DollarSign, ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ExpenseCard({ expenses }: { expenses?: number }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          $
          {expenses?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+5.4%</span> from last month
          <ArrowUpRight className="inline h-3 w-3" />
        </p>
        <CardDescription className="mt-2">
          Expenses for the current month.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
