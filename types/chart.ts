export interface PriceRange {
  range: string;
  count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface CombinedStatsResponse {
  status: "success" | "error";
  data?: {
    month: {
      number: number;
      name: string;
    };
    statistics: {
      totalSaleAmount: number;
      soldItems: number;
      notSoldItems: number;
    };
    priceRanges: PriceRange[];
    categoryDistribution: CategoryStat[];
  };
  message?: string;
  error?: string;
}
