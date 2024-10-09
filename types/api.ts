import { Transaction } from "./transcation";

export interface TransactionListResponse {
  status: "success" | "error";
  data?: {
    transactions: Transaction[];
    pagination: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  };
  message?: string;
  error?: string;
}

export interface StatisticsResponse {
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
  };
  message?: string;
  error?: string;
}
