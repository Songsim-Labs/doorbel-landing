"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Calendar, 
  DollarSign, 
  FileText,
  XCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

interface FailedTransaction {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
  };
  order?: {
    _id: string;
    orderNumber: string;
    customer?: any;
    rider?: any;
    pricing: any;
    status: string;
    paymentStatus: string;
  };
  type: string;
  amount: number;
  currency: string;
  reference: string;
  status: string;
  metadata?: {
    errorMessage?: string;
    failureReason?: string;
    ticketId?: string;
    ticketNumber?: string;
    retryCount?: number;
    lastRetryAt?: string;
    payoutFailure?: boolean;
    paymentChannel?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export default function FailedTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"payouts" | "payments">("payouts");
  const [transactions, setTransactions] = useState<FailedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<FailedTransaction | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchFailedTransactions();
  }, [activeTab, pagination.page, dateFrom, dateTo]);

  const fetchFailedTransactions = async () => {
    setLoading(true);
    try {
      const type = activeTab === "payouts" ? "transfer" : "order";
      const params = new URLSearchParams({
        type,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const response = await apiClient.getFailedTransactions(
        activeTab === "payouts" ? "transfer" : "order",
        pagination.page,
        pagination.limit,
        dateFrom,
        dateTo
      );
      
      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch failed transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayout = async (transactionId: string) => {
    setRetrying(transactionId);
    try {
      const response = await apiClient.retryFailedPayout(transactionId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Payout retry successful",
        });
        
        // Refresh the list
        fetchFailedTransactions();
        setRetryDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Retry Failed",
        description: error.response?.data?.message || "Failed to retry payout",
        variant: "destructive",
      });
    } finally {
      setRetrying(null);
    }
  };

  const handleViewDetails = async (transaction: FailedTransaction) => {
    try {
      const response = await apiClient.getFailedTransactionDetails(transaction._id);
      
      if (response.success) {
        setSelectedTransaction(response.data);
        setDetailsDialogOpen(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch transaction details",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "destructive" | "secondary" | "default"> = {
      failed: "destructive",
      pending: "secondary",
      processing: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getTransactionTypeBadge = (type: string) => {
    return (
      <Badge variant={type === "transfer" ? "default" : "secondary"}>
        {type === "transfer" ? "Rider Payout" : "Customer Payment"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Failed Transactions</h1>
        <p className="text-muted-foreground mt-2">
          Manage failed customer payments and rider payouts
        </p>
      </div>

      {/* Alert Banner */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment Failure Management</AlertTitle>
        <AlertDescription>
          Review and retry failed transactions. Rider payouts fail if Paystack transfer encounters issues.
          Customer payments fail due to insufficient funds or network issues.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchFailedTransactions}
                className="w-full"
                variant="outline"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="payouts">
            Failed Rider Payouts ({activeTab === "payouts" ? pagination.total : "-"})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Failed Customer Payments ({activeTab === "payments" ? pagination.total : "-"})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Rider Payouts</CardTitle>
              <CardDescription>
                Review and retry failed rider payouts. Support tickets are automatically created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No failed rider payouts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Rider</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Error Reason</TableHead>
                        <TableHead>Support Ticket</TableHead>
                        <TableHead>Failed At</TableHead>
                        <TableHead>Retries</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx._id}>
                          <TableCell className="font-medium">
                            {tx.order?.orderNumber || "N/A"}
                          </TableCell>
                          <TableCell>
                            {tx.user.firstName} {tx.user.lastName}
                            <br />
                            <span className="text-xs text-muted-foreground">{tx.user.phone}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {tx.currency} {tx.amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-sm text-red-600">
                              {tx.metadata?.errorMessage || tx.metadata?.failureReason || "Unknown error"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {tx.metadata?.ticketNumber ? (
                              <Badge variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                {tx.metadata.ticketNumber}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No ticket</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(tx.createdAt), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {tx.metadata?.retryCount || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(tx)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedTransaction(tx);
                                  setRetryDialogOpen(true);
                                }}
                                disabled={retrying === tx._id}
                              >
                                {retrying === tx._id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {transactions.length} of {pagination.total} transactions
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Customer Payments</CardTitle>
              <CardDescription>
                Review failed customer payment attempts. These are informational only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No failed customer payments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Error Reason</TableHead>
                        <TableHead>Failed At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx._id}>
                          <TableCell className="font-medium">
                            {tx.order?.orderNumber || "N/A"}
                          </TableCell>
                          <TableCell>
                            {tx.user.firstName} {tx.user.lastName}
                            <br />
                            <span className="text-xs text-muted-foreground">{tx.user.email}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {tx.currency} {tx.amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge>{tx.metadata?.paymentChannel || "Unknown"}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-sm text-red-600">
                              {tx.metadata?.failureReason || tx.metadata?.errorMessage || "Unknown error"}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(tx.createdAt), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(tx)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {transactions.length} of {pagination.total} transactions
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about the failed transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction._id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reference</Label>
                  <p className="font-mono text-sm">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div>{getTransactionTypeBadge(selectedTransaction.type)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-lg font-bold">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Failed At</Label>
                  <p>{format(new Date(selectedTransaction.createdAt), "PPpp")}</p>
                </div>
              </div>

              {selectedTransaction.order && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Order Number</Label>
                      <p>{selectedTransaction.order.orderNumber}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Order Status</Label>
                      <Badge>{selectedTransaction.order.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Payment Status</Label>
                      <Badge>{selectedTransaction.order.paymentStatus}</Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p>
                      {selectedTransaction.user.firstName} {selectedTransaction.user.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p>{selectedTransaction.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p>{selectedTransaction.user.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">User Type</Label>
                    <Badge>{selectedTransaction.user.type}</Badge>
                  </div>
                </div>
              </div>

              {selectedTransaction.metadata && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Error Details</h3>
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Failure Reason</AlertTitle>
                    <AlertDescription>
                      {selectedTransaction.metadata.errorMessage || 
                       selectedTransaction.metadata.failureReason || 
                       "Unknown error"}
                    </AlertDescription>
                  </Alert>

                  {selectedTransaction.metadata.ticketNumber && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Support Ticket Created</span>
                      </div>
                      <p className="text-sm mt-1">
                        Ticket #{selectedTransaction.metadata.ticketNumber} was automatically created
                      </p>
                    </div>
                  )}

                  {selectedTransaction.metadata.retryCount && selectedTransaction.metadata.retryCount > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">Retry Attempts: {selectedTransaction.metadata.retryCount}</span>
                      </div>
                      {selectedTransaction.metadata.lastRetryAt && (
                        <p className="text-sm mt-1">
                          Last retry: {format(new Date(selectedTransaction.metadata.lastRetryAt), "PPpp")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Retry Confirmation Dialog */}
      <Dialog open={retryDialogOpen} onOpenChange={setRetryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retry Payout?</DialogTitle>
            <DialogDescription>
              This will attempt to process the payout again via Paystack.
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payout Details</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p><strong>Order:</strong> #{selectedTransaction.order?.orderNumber}</p>
                    <p><strong>Rider:</strong> {selectedTransaction.user.firstName} {selectedTransaction.user.lastName}</p>
                    <p><strong>Amount:</strong> {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}</p>
                    <p><strong>Previous Retries:</strong> {selectedTransaction.metadata?.retryCount || 0}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Previous Error</AlertTitle>
                <AlertDescription>
                  {selectedTransaction.metadata?.errorMessage || "Unknown error"}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRetryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedTransaction && handleRetryPayout(selectedTransaction._id)}
              disabled={retrying !== null}
            >
              {retrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

