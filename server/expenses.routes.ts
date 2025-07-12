import { Hono } from "hono";
import { createExpenseSchema } from "./expenses.validations";
import { zValidator } from "@hono/zod-validator";

type Expense = {
  id: string;
  title: string;
  amount: number;
};

const expenses: Expense[] = [];

export const expensesRouter = new Hono();

// Define a route to get expenses
expensesRouter.get("/", (c) => {
  return c.json({
    message: "List of expenses",
    data: expenses,
  });
});

// Total expenses route
expensesRouter.get("/total", async (c) => {
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  return c.json({
    message: "Total expenses",
    total,
  });
});

// Define a route to add an expense
expensesRouter.post("/", zValidator("json", createExpenseSchema), (c) => {
  const data = c.req.valid("json");

  // Here you would typically save the expense to a database
  const newExpense: Expense = {
    id: crypto.randomUUID(), // Generate a unique ID
    title: data.title,
    amount: data.amount,
  };

  // Add the new expense to the in-memory array
  expenses.push(newExpense);

  return c.json({
    message: "Expense created successfully",
    data: newExpense,
  });
});

// Define a route to get a specific expense by ID
expensesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  // Here you would typically fetch the expense from a database
  const expense = expenses.find((expense) => expense.id === id);

  return c.json({
    message: `Expense with ID ${id}`,
    data: expense,
  });
});

// Define a route to delete an expense by ID
expensesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  // Here you would typically delete the expense from a database
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return c.json({ message: `Expense with ID ${id} not found` }, 404);
  }
  expenses.splice(index, 1);

  return c.json({
    message: `Expense with ID ${id} deleted successfully`,
  });
});

// Define a route to update an expense by ID
expensesRouter.put(
  "/:id",
  zValidator("json", createExpenseSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    // Here you would typically update the expense in a database
    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.json({ message: `Expense with ID ${id} not found` }, 404);
    }

    const updatedExpense: Expense = {
      id,
      title: data.title,
      amount: data.amount,
    };

    return c.json({
      message: `Expense with ID ${id} updated successfully`,
      data: updatedExpense,
    });
  }
);
