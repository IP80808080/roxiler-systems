import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CombinedStatsResponse } from "@/types/chart";
import { useEffect, useState } from "react";

export default function SalesStats({ month }: { month: string }) {
  const [stats, setStats] = useState<CombinedStatsResponse | null>(null);

  const monthNumber = getMonthNumber(month);

  console.log(`month ${monthNumber}`);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `/api/transcations/statistics?month=${monthNumber}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data: CombinedStatsResponse = await response.json();

        setStats(data);
      } catch (err) {
        console.error("Error calling API:", err);
      }
    };

    if (month) {
      fetchStatistics();
    }
  }, [month]);

  if (!stats) {
    return <div className="text-center">No data available</div>;
  }

  console.log(stats.data?.statistics.totalSaleAmount);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Statistics - {month}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="bg-yellow-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Total sale</div>
                <div className="text-sm text-right">
                  ${stats.data?.statistics.totalSaleAmount.toFixed(2)}
                </div>
                <div className="text-sm font-medium">Total sold item</div>
                <div className="text-sm text-right">
                  {stats.data?.statistics.soldItems}
                </div>
                <div className="text-sm font-medium">Total not sold item</div>
                <div className="text-sm text-right">
                  {stats.data?.statistics.notSoldItems}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

const getMonthNumber = (monthName: string) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames.indexOf(monthName) + 1;
};
