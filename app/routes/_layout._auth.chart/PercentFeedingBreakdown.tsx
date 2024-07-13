import { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./chart.module.css";

type FeedingDataPoint = {
  start: string;
  amount: number;
  type: "breast milk" | "formula";
};

export function PercentFeedingBreakdown(props: {
  data: FeedingDataPoint[] | undefined;
}) {
  const byDate = useMemo(() => {
    const byDate: Record<
      string,
      Record<"breast milk" | "formula", number>
    > = {};
    props.data?.forEach((d) => {
      const key = new Date(d.start).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const arr =
        byDate[key] || (byDate[key] = { "breast milk": 0, formula: 0 });

      arr[d.type] += d.amount;
    });
    return Object.entries(byDate).map(
      ([key, d]: [string, Record<"breast milk" | "formula", number>]) => {
        const total = d["breast milk"] + d["formula"];
        return {
          date: key,
          breastMilk: d["breast milk"],
          formula: d["formula"],
          breastMilkPercent: d["breast milk"] / total,
          formulaPercent: d["formula"] / total,
        };
      }
    );
  }, [props.data]);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer minHeight={400} minWidth={700}>
        <LineChart width={100} height={100} data={byDate}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="date"
            interval={"preserveStartEnd"}
            allowDuplicatedCategory={false}
          />
          <YAxis
            dataKey="breastMilkPercent"
            type={"number"}
            tickFormatter={(x) => x * 100 + "%"}
            domain={[0, 1]}
          />
          <Line dataKey="breastMilkPercent" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
