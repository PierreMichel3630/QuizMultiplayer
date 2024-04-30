import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
import { isInt } from "src/utils/calcul";

export interface DataDonut {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: Array<DataDonut>;
}

export const DonutChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          stroke="none"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          cornerRadius={5}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((el, index) => (
            <Cell key={`cell-${index}`} fill={el.color} />
          ))}
          <LabelList
            dataKey="name"
            position="outside"
            fontSize={12}
            fontWeight={700}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const valueText = isInt(value) ? value : value.toFixed(1);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontWeight={700}
      fontSize={14}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {valueText}
    </text>
  );
};
