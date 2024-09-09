import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const ExpenseChart = ({ expenses }) => {
  const chartdata = processExpensesData(expenses);

  return (
    <div className="w-full h-[300px] bg-[#252526] p-4 rounded-lg">
      <h3 className="text-[#cccccc] text-lg mb-4">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartdata}>
          <XAxis
            dataKey="category"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#3c3c3c', border: 'none' }}
            labelStyle={{ color: '#cccccc' }}
            itemStyle={{ color: '#cccccc' }}
          />
          <Bar dataKey="amount" fill="#0078d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

function processExpensesData(expenses) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.type]) {
      acc[expense.type] = 0;
    }
    acc[expense.type] += expense.amount;
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
}

export default ExpenseChart;
