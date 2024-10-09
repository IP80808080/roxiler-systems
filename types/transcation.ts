export interface Transaction {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  page: number;
  perPage: number;
}
