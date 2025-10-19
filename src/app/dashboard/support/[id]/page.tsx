'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useTicket,
  useCannedResponses,
  useRespondToTicket,
  useAssignTicket,
  useUpdateTicketPriority,
  useUpdateTicketStatus,
} from '@/hooks/queries/useSupportQueries';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Ticket, TicketMessage, CannedResponse, TicketStatus, TicketPriority } from '@/types/support';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Send, 
  Paperclip, 
  Eye, 
  User, 
  Building, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { config } from '@/lib/config';

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { on, off } = useWebSocket();
  const ticketId = params.id as string;

  const { data, isLoading, refetch } = useTicket(ticketId);
  const { data: cannedResponses } = useCannedResponses();
  const respondMutation = useRespondToTicket();
  const assignMutation = useAssignTicket();
  const updatePriorityMutation = useUpdateTicketPriority();
  const updateStatusMutation = useUpdateTicketStatus();

  const [responseText, setResponseText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [selectedCannedResponse, setSelectedCannedResponse] = useState<string>('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ticket = data?.ticket;
  const messages = data?.messages || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket real-time updates
  useEffect(() => {
    const handleTicketResponse = (data: any) => {
      console.log('WebSocket: Received ticket response', data);
      if (data.ticketId === ticketId) {
        // Refetch ticket to get new message
        refetch();
      }
    };

    const handleTicketUserResponse = (data: any) => {
      console.log('WebSocket: Received user response', data);
      if (data.ticketId === ticketId) {
        // Refetch ticket to get new message
        refetch();
      }
    };

    const handleTicketStatusUpdate = (data: any) => {
      console.log('WebSocket: Received status update', data);
      if (data.ticketId === ticketId) {
        // Refetch ticket to get updated status
        refetch();
      }
    };

    // Subscribe to WebSocket events
    on('ticket_response', handleTicketResponse);
    on('ticket_user_response', handleTicketUserResponse);
    on('ticket_status_update', handleTicketStatusUpdate);

    // Cleanup on unmount
    return () => {
      off('ticket_response', handleTicketResponse);
      off('ticket_user_response', handleTicketUserResponse);
      off('ticket_status_update', handleTicketStatusUpdate);
    };
  }, [ticketId, on, off, refetch]);

  const handleCannedResponseSelect = (responseId: string) => {
    const response = cannedResponses?.find((r: CannedResponse) => r._id === responseId);
    if (response) {
      setResponseText(response.content);
      setSelectedCannedResponse(responseId);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const totalFiles = attachmentFiles.length + fileArray.length;

    if (totalFiles > 5) {
      toast.error('Maximum 5 attachments allowed');
      return;
    }

    // Validate file sizes (5MB max each)
    const invalidFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Some files exceed 5MB limit');
      return;
    }

    setAttachmentFiles([...attachmentFiles, ...fileArray]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index));
  };

  const handleSendResponse = async () => {
    if (!ticketId || !responseText.trim()) return;

    // Create FormData to send message with files
    const formData = new FormData();
    formData.append('message', responseText.trim());
    formData.append('isInternal', isInternal.toString());
    
    if (selectedCannedResponse) {
      formData.append('cannedResponseId', selectedCannedResponse);
    }

    // Add file attachments if any
    attachmentFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      setUploadingAttachments(true);
      const token = Cookies.get('adminAccessToken'); // Use same token storage as API client

      console.log('Sending response with attachments:', {
        message: responseText.substring(0, 50),
        fileCount: attachmentFiles.length,
        isInternal,
        hasToken: !!token,
      });

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(
        `${config.apiUrl}/api/v1/support/admin/tickets/${ticketId}/respond`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type - browser handles multipart/form-data boundary
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send response');
      }

      const result = await response.json();
      console.log('Response sent successfully:', result);

      toast.success('Response sent successfully');
      
      // Clear form
      setResponseText('');
      setIsInternal(false);
      setSelectedCannedResponse('');
      setAttachmentFiles([]);
      
      // Refetch ticket data
      refetch();
    } catch (error: any) {
      console.error('Send response error:', error);
      toast.error(error.message || 'Failed to send response');
    } finally {
      setUploadingAttachments(false);
    }
  };

  const handleAssign = (adminId: string) => {
    assignMutation.mutate({ ticketId, adminId });
  };

  const handlePriorityChange = (priority: string) => {
    updatePriorityMutation.mutate({ ticketId, priority });
  };

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({ ticketId, status });
  };

  if (isLoading || !ticket) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  const priorityColors: Record<TicketPriority, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/support">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Ticket #{ticket.ticketNumber}
              </h1>
              <Badge 
                variant={ticket.status === 'closed' ? 'secondary' : 'default'}
                className="text-sm"
              >
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge 
                variant="outline" 
                className={priorityColors[ticket.priority]}
              >
                {ticket.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Select
            value={ticket.priority}
            onValueChange={handlePriorityChange}
            disabled={updatePriorityMutation.isPending}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ticket.status}
            onValueChange={handleStatusChange}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="awaiting_response">Awaiting Response</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Ticket Information */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={ticket.user.avatar?.url} />
                  <AvatarFallback>
                    {ticket.user.firstName[0]}{ticket.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">
                    {ticket.user.firstName} {ticket.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{ticket.user.email}</p>
                  <p className="text-sm text-muted-foreground">{ticket.user.phone}</p>
                  <Badge variant="outline" className="mt-2">
                    {ticket.userType === 'customer' ? (
                      <><User className="h-3 w-3 mr-1" /> Customer</>
                    ) : (
                      <><Building className="h-3 w-3 mr-1" /> Rider</>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm">Category</Label>
                <p className="font-medium capitalize mt-1">
                  {ticket.category.replace(/_/g, ' ')}
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground text-sm">Subject</Label>
                <p className="font-medium mt-1">{ticket.subject}</p>
              </div>

              {ticket.relatedOrder && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-sm">Related Order</Label>
                    <Badge variant="outline" className="mt-1 cursor-pointer" asChild>
                      <Link href={`/dashboard/orders/${ticket.relatedOrder._id}`}>
                        #{ticket.relatedOrder.orderNumber}
                      </Link>
                    </Badge>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label className="text-muted-foreground text-sm">Assigned To</Label>
                {ticket.assignedTo ? (
                  <p className="font-medium mt-1">
                    {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Unassigned</p>
                )}
                {!ticket.assignedTo && user && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => handleAssign(user._id)}
                    disabled={assignMutation.isPending}
                  >
                    Assign to Me
                  </Button>
                )}
              </div>

              {ticket.tags && ticket.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-sm">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ticket.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticket.firstResponseAt ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">First Response</p>
                    <p className="font-medium text-sm">
                      {formatDistanceToNow(new Date(ticket.firstResponseAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-600">
                      No response yet
                    </p>
                  </div>
                </div>
              )}

              {ticket.resolutionTime && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Resolution Time</p>
                      <p className="font-medium text-sm">
                        {Math.floor(ticket.resolutionTime)} minutes
                      </p>
                    </div>
                  </div>
                </>
              )}

              {ticket.satisfactionRating && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="font-medium text-sm">
                        {ticket.satisfactionRating}/5 ⭐
                      </p>
                      {ticket.satisfactionFeedback && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          &ldquo;{ticket.satisfactionFeedback}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Conversation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Initial Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issue Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {ticket.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer hover:opacity-80 border"
                      onClick={() => setViewingImage(att.url)}
                    >
                      <img src={att.url} alt={att.filename} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversation</CardTitle>
              <CardDescription>
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((message: TicketMessage) => {
                    const isAdmin = message.senderType === 'admin';
                    const isInternal = message.isInternal;

                    return (
                      <div
                        key={message._id}
                        className={`flex gap-3 ${
                          isInternal ? 'bg-amber-50 p-4 rounded-lg border border-amber-200' : ''
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar?.url} />
                          <AvatarFallback className={isAdmin ? 'bg-primary text-white' : 'bg-secondary'}>
                            {message.sender.firstName[0]}{message.sender.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">
                              {message.sender.firstName} {message.sender.lastName}
                            </span>
                            {isAdmin && (
                              <Badge variant="default" className="text-xs">Support Team</Badge>
                            )}
                            {isInternal && (
                              <Badge variant="secondary" className="text-xs">Internal Note</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                            {message.message}
                          </p>
                          {message.attachments.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {message.attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80 border"
                                  onClick={() => setViewingImage(att.url)}
                                >
                                  <img src={att.url} alt={att.filename} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Eye className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Response Section */}
              {ticket.status !== 'closed' && (
                <div className="mt-6 space-y-4 border-t pt-6">
                  <div className="flex gap-2 items-center">
                    <Select value={selectedCannedResponse} onValueChange={handleCannedResponseSelect}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Use canned response..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cannedResponses?.map((response: CannedResponse) => (
                          <SelectItem key={response._id} value={response._id}>
                            {response.title} ({response.shortcut})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 ml-auto">
                      <Checkbox
                        id="internal"
                        checked={isInternal}
                        onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                      />
                      <Label htmlFor="internal" className="text-sm cursor-pointer">
                        Internal Note
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Textarea
                      placeholder="Type your response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  {/* Attachment Preview */}
                  {attachmentFiles.length > 0 && (
                    <div className="flex gap-3 flex-wrap p-2 bg-muted/30 rounded-md">
                      {attachmentFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="w-24 h-24 rounded-lg border-2 border-border bg-background flex items-center justify-center overflow-hidden shadow-sm">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Paperclip className="h-8 w-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {file.name.split('.').pop()?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-destructive/90 hover:scale-110 transition-all border-2 border-white"
                            title="Remove attachment"
                          >
                            <span className="text-sm font-bold">×</span>
                          </button>
                          <p className="text-xs text-muted-foreground mt-1 truncate w-24 text-center">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAttachments || attachmentFiles.length >= 5}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files ({attachmentFiles.length}/5)
                    </Button>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!responseText.trim() || uploadingAttachments}
                      size="sm"
                    >
                      {uploadingAttachments ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Response
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {ticket.status === 'closed' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border text-center">
                  <p className="text-sm text-muted-foreground">
                    This ticket is closed. To continue the conversation, change the status to &ldquo;Open&rdquo;.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Viewer */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setViewingImage(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img
              src={viewingImage}
              alt="Attachment"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

