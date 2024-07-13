import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./chart.module.css";

type DataPoint = { x: Date; timeOfDay: number; y: number; cumulative: number };

const formatTime = (hours: number) => {
  if (hours === 0) {
    return "12am";
  }
  if (hours === 12) {
    return "12pm";
  }
  if (hours < 12) {
    return hours + "am";
  }
  return hours - 12 + "pm";
};

export function Chart(props: {
  data: { start: string; amount: number }[] | undefined;
}) {
  const items = useMemo<[string, DataPoint[]][]>(() => {
    const dates: Record<string, DataPoint[]> = {};
    props.data?.forEach((d) => {
      const key = new Date(d.start).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const arr = dates[key] || (dates[key] = []);
      const date = new Date(d.start);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      arr.push({
        x: date,
        timeOfDay: (date.getTime() - startOfDay.getTime()) / 1000 / 60 / 60,
        y: d.amount,
        cumulative: 0,
      });
    });

    Object.values(dates).forEach((items) => {
      let cumulative = 0;
      const startOfDay = new Date(
        items[0].x.getFullYear(),
        items[0].x.getMonth(),
        items[0].x.getDate()
      );

      items.forEach((item) => {
        cumulative += item.y;
        item.cumulative = cumulative;
      });

      items.unshift({
        x: startOfDay,
        timeOfDay: 0,
        cumulative: 0,
        y: 0,
      });
    });

    return Object.entries(dates) as [string, DataPoint[]][];
  }, [props.data]);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer minHeight={400} minWidth={700}>
        <LineChart width={100} height={100} id={"abc"}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="timeOfDay"
            type={"number"}
            interval={"preserveStartEnd"}
            tickCount={9}
            allowDuplicatedCategory={false}
            tickFormatter={formatTime}
          />
          <YAxis dataKey="cumulative" type={"number"} />
          {items.map(([name, data]) => {
            const daysInPast =
              (items.at(-1)![1][0].x.getTime() - data[0].x.getTime()) /
              1000 /
              3600 /
              24;

            const strokeOpacity =
              daysInPast === 0
                ? 1
                : (240 - Math.floor(Math.log(daysInPast * 10) * 50)) / 255;

            if (strokeOpacity < 0) {
              return null;
            }

            return (
              <Line
                dataKey="cumulative"
                data={data}
                name={name}
                key={name}
                dot={{
                  r: 5,
                  strokeWidth: daysInPast === 0 ? 3 : 1,
                  fill: "var(--background)",
                }}
                stroke={daysInPast === 0 ? `var(--today)` : `var(--past)`}
                strokeWidth={daysInPast === 0 ? 2 : 1.3}
                strokeOpacity={strokeOpacity}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
