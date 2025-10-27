import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export type HistoricalGraphProps<T> = {
  data: T[];
  xAccessor: (d: T) => number | string | Date;
  yAccessor: (d: T) => number;

  title?: string;
  height?: number;

  xTickFormat?: (v: any) => string;
  yTickFormat?: (v: number) => string;
  tooltipLabelFormat?: (label: any) => string;
  tooltipValueFormat?: (value: number) => string | [string | number, string];

  lineColor?: string;
  showDots?: boolean;
};

export default function HistoricalGraph<T>({
  data,
  xAccessor,
  yAccessor,
  title = "Histórico",
  height = 300,
  xTickFormat,
  yTickFormat,
  tooltipLabelFormat,
  tooltipValueFormat,
  lineColor = "#3b82f6",
  showDots = false,
}: HistoricalGraphProps<T>) {
  const formatted = data.map((d) => {
    const x = xAccessor(d);
    return {
      x,
      xLabel:
        x instanceof Date
          ? `${x.getHours()}h`
          : typeof x === "number"
          ? String(x)
          : x,
      y: yAccessor(d),
    };
  });

  return (
    <div>
      {title && <h5 className="mb-3">{title}</h5>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="xLabel"
            tickFormatter={xTickFormat}
          />
          <YAxis
            tickFormatter={yTickFormat}
          />
          <Tooltip
            labelFormatter={tooltipLabelFormat}
            formatter={(value: any) =>
              tooltipValueFormat ? tooltipValueFormat(value) : [`${value}`, "Valor"]
            }
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke={lineColor}
            strokeWidth={2}
            dot={showDots}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
