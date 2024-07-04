import { useQuery } from "react-query";
import { Chart } from "./Chart";
import { fetchApi } from "~/utils/fetchApi";
import { PercentFeedingBreakdown } from "./PercentFeedingBreakdown";
import { useMemo } from "react";

export default function ChartPage() {
  const { data: pumpingData } = useQuery<{ start: string; amount: number }[]>(
    ["pumpings"],
    async () => {
      const data = await fetchApi("/pumping/");
      return data.results.reverse();
    }
  );

  const twoDaysAgoDate = new Date();
  twoDaysAgoDate.setDate(twoDaysAgoDate.getDate() - 2);
  const twoDaysAgo = twoDaysAgoDate.toISOString().substring(0, 10);
  const { data: historicalFeedingData } = useQuery(
    ["feedings", "historical", twoDaysAgo],
    async () => {
      const data: {
        start: string;
        amount: number;
        type: "breast milk" | "formula";
      }[] = [];
      let query = "start_max=" + twoDaysAgo;
      // eslint-disable-next-line no-constant-condition
      while (query) {
        const thisData = await fetchApi("/feedings/?" + query);
        data.unshift(...thisData.results.reverse());
        query = thisData.next?.split("?")[1];
      }
      return data;
    },
    {
      refetchInterval: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: recentFeedingData } = useQuery<
    { start: string; amount: number; type: "breast milk" | "formula" }[]
  >(["feedings", "recent", twoDaysAgo], async () => {
    const data = await fetchApi("/feedings/?start_min=" + twoDaysAgo);
    return data.results.reverse();
  });

  const feedingData = useMemo(() => {
    return (
      historicalFeedingData &&
      recentFeedingData && [...historicalFeedingData, ...recentFeedingData]
    );
  }, [historicalFeedingData, recentFeedingData]);

  return (
    <>
      <h2>Pumping</h2>
      <Chart data={pumpingData} />
      <h2>Feeding</h2>
      <Chart data={feedingData} />
      <PercentFeedingBreakdown data={feedingData} />
    </>
  );
}
