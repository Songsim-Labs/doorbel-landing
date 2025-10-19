'use client';

import { useState } from 'react';
import { useKYCs, useApproveKYC, useRejectKYC } from '@/hooks/queries/useRiderQueries';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { KYC, KYCStatus } from '@/types/rider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DocumentViewer } from '@/components/admin/DocumentViewer';
import { Check, X, Eye, FileCheck, AlertCircle, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { exportKYC } from '@/lib/export-utils';

export default function KYCApprovalsPage() {
  // Enable WebSocket query invalidation
  useQueryInvalidation();
  
  const [selectedKYC, setSelectedKYC] = useState<KYC | null>(null);
  const [activeTab, setActiveTab] = useState<KYCStatus>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewerImage, setViewerImage] = useState<{ url: string; title: string } | null>(null);
  
  // Fetch KYCs with React Query
  const { data, isLoading } = useKYCs(1, 50, activeTab);
  const kycSubmissions = data?.kyc || [];
  
  // Mutations
  const approveMutation = useApproveKYC();
  const rejectMutation = useRejectKYC();
  
  const handleApprove = async (kycId: string) => {
    approveMutation.mutate(kycId, {
      onSuccess: () => {
        setSelectedKYC(null);
      },
    });
  };
  
  const handleReject = async (kycId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    rejectMutation.mutate({ kycId, reason: rejectionReason }, {
      onSuccess: () => {
        setSelectedKYC(null);
        setRejectionReason('');
      },
    });
  };
  
  const isProcessing = approveMutation.isPending || rejectMutation.isPending;
  
  const getRiderName = (kyc: KYC) => {
    if (typeof kyc.rider === 'object' && 'auth' in kyc.rider) {
      return `${kyc.rider.auth.firstName} ${kyc.rider.auth.lastName}`;
    }
    return 'Unknown Rider';
  };
  
  const getRiderPhone = (kyc: KYC) => {
    if (typeof kyc.rider === 'object' && 'contactPhone' in kyc.rider) {
      return kyc.rider.contactPhone;
    }
    return 'N/A';
  };
  
  const handleExport = () => {
    try {
      if (kycSubmissions.length === 0) {
        toast.error('No KYC submissions to export');
        return;
      }
      exportKYC(kycSubmissions);
      toast.success(`Exported ${kycSubmissions.length} KYC submissions to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export KYC submissions');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Approvals</h1>
          <p className="text-muted-foreground">Review and approve rider verification documents</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={kycSubmissions.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as KYCStatus)}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {!isLoading && kycSubmissions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {kycSubmissions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : !Array.isArray(kycSubmissions) || kycSubmissions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No {activeTab} KYC submissions</h3>
                <p className="text-muted-foreground text-sm">
                  {activeTab === 'pending'
                    ? 'All KYC submissions have been reviewed'
                    : `No ${activeTab} KYC submissions found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(kycSubmissions) && kycSubmissions.map((kyc) => (
                <Card key={kyc._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{getRiderName(kyc)}</CardTitle>
                    <CardDescription>{getRiderPhone(kyc)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Document Previews */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80"
                        onClick={() => setViewerImage({ url: kyc.idCardFront.url, title: 'ID Card Front' })}
                      >
                        <img
                          src={kyc.idCardFront.url}
                          alt="ID Front"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      <div
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80"
                        onClick={() => setViewerImage({ url: kyc.idCardBack.url, title: 'ID Card Back' })}
                      >
                        <img
                          src={kyc.idCardBack.url}
                          alt="ID Back"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID Number:</span>{' '}
                        <span className="font-medium">{kyc.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License Plate:</span>{' '}
                        <span className="font-medium">{kyc.licensePlateNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>{' '}
                        <span className="font-medium">
                          {new Date(kyc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {kyc.status === 'rejected' && kyc.reason && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                            <p className="text-xs text-muted-foreground mt-1">{kyc.reason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedKYC(kyc)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    {kyc.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleApprove(kyc._id)}
                          disabled={isProcessing}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* KYC Details Dialog */}
      <Dialog open={!!selectedKYC} onOpenChange={() => setSelectedKYC(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedKYC && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">KYC Review</DialogTitle>
                <DialogDescription>
                  Review all documents for {getRiderName(selectedKYC)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6">
                {/* All Documents */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">ID Card Front</Label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => setViewerImage({ url: selectedKYC.idCardFront.url, title: 'ID Card Front' })}
                    >
                      <img
                        src={selectedKYC.idCardFront.url}
                        alt="ID Front"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">ID Card Back</Label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => setViewerImage({ url: selectedKYC.idCardBack.url, title: 'ID Card Back' })}
                    >
                      <img
                        src={selectedKYC.idCardBack.url}
                        alt="ID Back"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Selfie</Label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => setViewerImage({ url: selectedKYC.selfie.url, title: 'Selfie' })}
                    >
                      <img
                        src={selectedKYC.selfie.url}
                        alt="Selfie"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">License Plate</Label>
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => setViewerImage({ url: selectedKYC.licensePlateImage.url, title: 'License Plate' })}
                    >
                      <img
                        src={selectedKYC.licensePlateImage.url}
                        alt="License Plate"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rider Name</Label>
                    <p className="text-sm font-medium">{getRiderName(selectedKYC)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <p className="text-sm font-medium">{getRiderPhone(selectedKYC)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Number</Label>
                    <p className="text-sm font-medium">{selectedKYC.idNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>License Plate Number</Label>
                    <p className="text-sm font-medium">{selectedKYC.licensePlateNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Submission Date</Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedKYC.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <StatusBadge status={selectedKYC.status} type="kyc" />
                  </div>
                </div>
                
                {/* Rejection Reason (if pending) */}
                {selectedKYC.status === 'pending' && (
                  <div className="space-y-2">
                    <Label htmlFor="reason">Rejection Reason (optional)</Label>
                    <Textarea
                      id="reason"
                      placeholder="Provide a reason if rejecting this KYC submission..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                
                {/* Existing Rejection Reason */}
                {selectedKYC.status === 'rejected' && selectedKYC.reason && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-destructive mb-1">Rejection Reason</h4>
                        <p className="text-sm text-muted-foreground">{selectedKYC.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedKYC.status === 'pending' && (
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedKYC(null)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedKYC._id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApprove(selectedKYC._id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Document Viewer */}
      {viewerImage && (
        <DocumentViewer
          imageUrl={viewerImage.url}
          title={viewerImage.title}
          open={!!viewerImage}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  );
}

