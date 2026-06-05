export default function KPIs({ employees }) {
  const data = employees?.data || []; // 🔥 SAFE

  const total = data.length;

  const fulltime = data.filter((e) => e.type === 'fulltime').length;

  const parttime = data.filter((e) => e.type === 'parttime').length;

  const managers = data.filter((e) => e.type === 'manager').length;

  const totalSalary = data.reduce(
    (sum, e) => sum + (e.salary || 0),
    0,
  );

  const avgSalary = total ? Math.round(totalSalary / total) : 0;

  const cards = [
    {
      title: 'Total Employees',
      value: total,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      title: 'Full Time',
      value: fulltime,
      color: 'bg-green-500',
      icon: '💼',
    },
    {
      title: 'Part Time',
      value: parttime,
      color: 'bg-yellow-500',
      icon: '🕒',
    },
    {
      title: 'Managers',
      value: managers,
      color: 'bg-purple-500',
      icon: '👔',
    },
    {
      title: 'Avg Salary',
      value: avgSalary + '€',
      color: 'bg-orange-500',
      icon: '💰',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-6 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4"
        >
          <div
            className={`${card.color} text-white p-3 rounded-lg text-xl`}
          >
            {card.icon}
          </div>

          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
