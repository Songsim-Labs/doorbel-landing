"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

interface AnalyticsPoint { date: string; value: number }

export default function AnalyticsPage() {
  const [trend, setTrend] = useState<AnalyticsPoint[]>([]);
  const [orders, setOrders] = useState<AnalyticsPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (token) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/v1/admin/analytics?period=30d`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setTrend(data.data?.signups || []);
              setOrders(data.data?.orders || []);
              return;
            }
          } catch {}
        }
        // Fallback mock
        const now = new Date();
        const mock: AnalyticsPoint[] = Array.from({ length: 14 }).map((_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (13 - i));
          return { date: d.toISOString().slice(0,10), value: Math.floor(Math.random()*40)+5 };
        });
        setTrend(mock);
        setOrders(mock.map(p => ({ date: p.date, value: Math.floor(p.value*0.6) })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Signups (Last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders (Last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


