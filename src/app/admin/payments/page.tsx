"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Filter, Calendar } from "lucide-react";

interface Payment {
  _id: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "refunded";
  method: string;
  customer?: { firstName: string; lastName: string };
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

        if (token) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/v1/admin/payments`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (res.ok) {
              const data = await res.json();
              setPayments(data.data?.payments || []);
              return;
            }
          } catch {}
        }

        // Fallback
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="border-green-200 text-green-700">Success</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Refunded</Badge>;
    }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">View and manage all transactions</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center text-sm px-3 py-2 border rounded-md">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </button>
          <button className="inline-flex items-center text-sm px-3 py-2 border rounded-md">
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.reference}</TableCell>
                    <TableCell>{p.customer ? `${p.customer.firstName} ${p.customer.lastName}` : '—'}</TableCell>
                    <TableCell>₵{p.amount}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="flex items-center text-sm"><Calendar className="h-3 w-3 mr-1 text-gray-400" />{fmt(p.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


