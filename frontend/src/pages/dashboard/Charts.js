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
  Legend,
} from 'recharts';

export default function Charts({ employees }) {
  const data = [
    {
      name: 'Full Time',
      value: employees.filter((e) => e.type === 'fulltime').length,
    },
    {
      name: 'Part Time',
      value: employees.filter((e) => e.type === 'parttime').length,
    },
    {
      name: 'Managers',
      value: employees.filter((e) => e.type === 'manager').length,
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
    </div>
  );
}
