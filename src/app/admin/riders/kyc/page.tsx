"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Application {
  _id: string;
  rider: { firstName: string; lastName: string; email: string };
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function RiderKYCPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (token) {
          const res = await fetch(`${API_BASE_URL}/api/v1/admin/kyc`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            setApps(data.data?.applications || []);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/kyc/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setApps(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    }
  };

  const badge = (s: Application["status"]) => s === 'approved'
    ? <Badge variant="outline" className="border-green-200 text-green-700">Approved</Badge>
    : s === 'rejected'
      ? <Badge variant="destructive">Rejected</Badge>
      : <Badge variant="outline" className="border-yellow-200 text-yellow-700">Pending</Badge>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Rider KYC</h1>
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[180px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map(a => (
                  <TableRow key={a._id}>
                    <TableCell>{a.rider.firstName} {a.rider.lastName}</TableCell>
                    <TableCell>{badge(a.status)}</TableCell>
                    <TableCell>{new Date(a.submittedAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a._id, 'approved')} disabled={a.status==='approved'}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(a._id, 'rejected')} disabled={a.status==='rejected'}>Reject</Button>
                    </TableCell>
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


