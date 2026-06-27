import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function Charts({ summary, depStats }) {
  const data = [
    {
      name: 'Full Time',
      value: summary?.fulltimeEmployees || 0,
    },
    {
      name: 'Part Time',
      value: summary?.parttimeEmployees || 0,
    },
    {
      name: 'Managers',
      value: summary?.managers || 0,
    },
  ];

  const COLORS = ['#4CAF50', '#FF9800', '#2196F3'];

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Employees Distribution</h2>

        <PieChart width={300} height={250}>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Employees Overview</h2>

        <BarChart width={350} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-4">
          Employees per Department
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.depStats}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
