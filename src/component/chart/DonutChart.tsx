import { Grid, Paper, Typography } from "@mui/material";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Colors } from "src/style/Colors";
import { isInt } from "src/utils/calcul";

export interface DataDonut {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  data: Array<DataDonut>;
}

export const DonutChart = ({ data, title }: Props) => {
  return (
    <Paper variant="outlined">
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.purple,
            p: 1,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              wordWrap: "break-word",
              fontSize: 25,
              color: Colors.white,
            }}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                stroke="none"
                innerRadius={50}
                outerRadius={120}
                paddingAngle={5}
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
                  fontSize={18}
                  fontWeight={700}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
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
      fontSize={16}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {valueText}
    </text>
  );
};
