"use client";

import { useState, useEffect } from "react";
import { Plus, DollarSign, TrendingUp } from "lucide-react";

type Expense = {
  id: string;
  amount: number;
  description: string;
  date: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/expenses/`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newAmount || !newDesc) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(newAmount),
          description: newDesc,
          date: new Date().toISOString()
        }),
      });
      if (res.ok) {
        setNewAmount("");
        setNewDesc("");
        setIsAdding(false);
        fetchExpenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Expenses</h1>
          <p className="text-slate-400">Track and manage your daily spending.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 border-red-500/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 font-medium">Total Spent</h3>
            <DollarSign className="text-red-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">${total.toFixed(2)}</p>
        </div>
        <div className="glass-panel p-6 border-blue-500/20">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 font-medium">Weekly Average</h3>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">${(total / 4).toFixed(2)}</p>
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-red-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Log New Expense</h2>
          <div className="flex gap-4">
            <input 
              type="number" 
              placeholder="Amount ($)" 
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              className="w-32 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
            <input 
              type="text" 
              placeholder="What did you buy?" 
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-slate-300 font-medium">Description</th>
              <th className="p-4 text-slate-300 font-medium">Date</th>
              <th className="p-4 text-slate-300 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{expense.description}</td>
                <td className="p-4 text-slate-400">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="p-4 text-red-400 font-bold text-right">-${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
            {expenses.length === 0 && !isAdding && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  No expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
