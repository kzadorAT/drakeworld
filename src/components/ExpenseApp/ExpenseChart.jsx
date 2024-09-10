import React, { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, CartesianGrid, PieChart, Pie, Sector, Cell } from 'recharts';

const ExpenseChart = ({ expenses }) => {
  const [timeRange, setTimeRange] = useState('365d');
  const [activePieCategory, setActivePieCategory] = useState('');

  const chartData = useMemo(() => processExpensesData(expenses), [expenses]);
  const areaChartData = useMemo(() => processAreaChartData(expenses, timeRange), [expenses, timeRange]);
  const radarChartData = useMemo(() => processRadarChartData(expenses), [expenses]);
  const pieChartData = useMemo(() => processPieChartData(expenses), [expenses]);

  useEffect(() => {
    if (pieChartData.length > 0 && !activePieCategory) {
      setActivePieCategory(pieChartData[0].category);
    }
  }, [pieChartData, activePieCategory]);

  const chartConfig = {
    amount: {
      label: "Monto",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Cantidad",
      color: "hsl(var(--chart-2))",
    },
  };

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#a4de6c", "#d0ed57", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
  ];

  const activePieIndex = useMemo(
    () => pieChartData.findIndex((item) => item.category === activePieCategory),
    [activePieCategory, pieChartData]
  );

  return (
    <div className="expense-charts">
      {chartData.length > 0 && (
        <div className="chart">
          <h3>Gastos por categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#0078d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {areaChartData.length > 0 && (
        <div className="chart">
          <h3>Gastos a lo largo del tiempo</h3>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="365d">Último año</option>
            <option value="180d">Últimos 6 meses</option>
            <option value="90d">Últimos 3 meses</option>
            <option value="30d">Últimos 30 días</option>
            <option value="7d">Últimos 7 días</option>
          </select>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              />
              <Legend />
              {Object.keys(areaChartData[0]).filter(key => key !== 'date').map((category, index) => (
                <Area 
                  key={category}
                  type="monotone" 
                  dataKey={category} 
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {radarChartData.length > 0 && (
        <div className="chart">
          <h3>Distribución de gastos por categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <Tooltip />
              <Radar name="Monto" dataKey="amount" stroke={chartConfig.amount.color} fill={chartConfig.amount.color} fillOpacity={0.6} />
              <Radar name="Cantidad" dataKey="count" stroke={chartConfig.count.color} fill={chartConfig.count.color} fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {pieChartData.length > 0 && (
        <div className="chart">
          <h3>Distribución de gastos por categoría</h3>
          <select 
            value={activePieCategory} 
            onChange={(e) => setActivePieCategory(e.target.value)}
          >
            {pieChartData.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                activeIndex={activePieIndex}
                activeShape={renderActiveShape}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.category}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value.toFixed(2)}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function processExpensesData(expenses) {
  if (!expenses || expenses.length === 0) return [];
  
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

function processAreaChartData(expenses, timeRange) {
  if (!expenses || expenses.length === 0) return [];
  
  const now = new Date();
  const daysToSubtract = timeRange === '180d' ? 180 : timeRange === '90d' ? 90 : timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 365;
  const startDate = new Date(now.setDate(now.getDate() - daysToSubtract));

  const dateMap = {};
  expenses.forEach(expense => {
    const date = new Date(expense.creation_date);
    if (date >= startDate) {
      const dateStr = date.toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {};
      }
      if (!dateMap[dateStr][expense.type]) {
        dateMap[dateStr][expense.type] = 0;
      }
      dateMap[dateStr][expense.type] += expense.amount;
    }
  });

  const categories = [...new Set(expenses.map(e => e.type))];
  
  return Object.entries(dateMap)
    .map(([date, categoryAmounts]) => ({
      date,
      ...categories.reduce((acc, category) => {
        acc[category] = categoryAmounts[category] || 0;
        return acc;
      }, {})
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function processRadarChartData(expenses) {
  if (!expenses || expenses.length === 0) return [];
  
  const categoryData = expenses.reduce((acc, expense) => {
    if (!acc[expense.type]) {
      acc[expense.type] = { amount: 0, count: 0 };
    }
    acc[expense.type].amount += expense.amount;
    acc[expense.type].count += 1;
    return acc;
  }, {});

  return Object.entries(categoryData).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count,
  }));
}

function processPieChartData(expenses) {
  if (!expenses || expenses.length === 0) return [];
  
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
