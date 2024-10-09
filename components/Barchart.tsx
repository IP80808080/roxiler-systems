"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = {
  range: string;
  count: number;
};

export default function Barchart({ month }: { month: string }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthNumber = getMonthNumber(month);

  useEffect(() => {
    const fetchPriceRanges = async () => {
      try {
        const response = await fetch(
          `/api/transcations/price-ranges?month=${monthNumber}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch price ranges");
        }
        const result = await response.json();
        setData(result.data.priceRanges);
        console.log(`Result: ${result.data.priceRanges}`);
      } catch (err) {
        console.error("Error fetching price ranges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRanges();
  }, [month]);

  return (
    <Card className="w-full md:max-w-3xl mx-auto bg-blue-50 max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          Bar Chart Stats - {month}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px] text-red-500">
            {error}
          </div>
        ) : (
          <ChartContainer
            config={{
              count: {
                color: "hsl(190, 100%, 70%)",
              },
            }}
            className="h-[200px] lg:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="aqua" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
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
