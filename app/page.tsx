"use client";
// This Project is originally created by Kamlesh Kasambe, Proof of Work
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SalesStats from "@/components/SalesStats";
import Barchart from "@/components/Barchart";

interface Transaction {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sold: boolean;
  image: string;
  dateOfSale: string;
}

interface ApiResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
}

export default function TransactionDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const response = await fetch("/api/seed", {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Database seeding successful:", data.message);
        } else {
          console.error("Failed to seed database:", data.error);
        }
      } catch (error) {
        console.error("Error calling seed API:", error);
      }
    };

    seedDatabase();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery, selectedMonth]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        search: searchQuery,
      });

      if (selectedMonth) {
        const monthNumber =
          new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth() + 1;
        queryParams.append("month", monthNumber.toString());
      }

      const response = await fetch(`/api/transcations?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data: ApiResponse = await response.json();
      setTransactions(data.transactions);
      setTotal(data.total);
      setPerPage(data.perPage);
      setError("");
    } catch (err) {
      setError("Failed to load transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-[#e6f2ff] p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Transaction Dashboard
        </h1>
        

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search transaction"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full bg-[#ffeeba] text-black placeholder-black"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-black" />
          </div>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-[#ffeeba] text-black border-none">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">Jan</SelectItem>
              <SelectItem value="February">Feb</SelectItem>
              <SelectItem value="March">Mar</SelectItem>
              <SelectItem value="April">Apr</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">Aug</SelectItem>
              <SelectItem value="September">Sep</SelectItem>
              <SelectItem value="October">Oct</SelectItem>
              <SelectItem value="November">Nov</SelectItem>
              <SelectItem value="December">Dec</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#ffeeba]">
                <TableHead className="text-black">ID</TableHead>
                <TableHead className="text-black">Title</TableHead>
                <TableHead className="text-black">Description</TableHead>
                <TableHead className="text-black">Price</TableHead>
                <TableHead className="text-black">Category</TableHead>
                <TableHead className="text-black">Sold</TableHead>
                <TableHead className="text-black">Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-[#ffeeba] rounded-full animate-bounce" />
                      <div className="w-4 h-4 bg-[#ffeeba] rounded-full animate-bounce delay-100" />
                      <div className="w-4 h-4 bg-[#ffeeba] rounded-full animate-bounce delay-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {searchQuery
                      ? "No matching transactions found"
                      : "No transactions available"}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="bg-[#fff9e6]">
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.price}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
                    <TableCell>{transaction.image}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>Page No: {currentPage}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>Per Page: {perPage}</div>
        </div>
      </div>
      <SalesStats month={selectedMonth} />
      <Barchart month={selectedMonth} />
    </div>
  );
}
