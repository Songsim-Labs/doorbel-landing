'use client';

import React, { useState, useEffect } from 'react';
import { useTicket, useRespondToTicket, useCannedResponses } from '@/hooks/queries/useSupportQueries';
import { Ticket, TicketMessage, CannedResponse } from '@/types/support';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Paperclip, Eye, User, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicketModalProps {
  ticketId: string | null;
  open: boolean;
  onClose: () => void;
  onAssign?: (ticketId: string, adminId: string) => void;
  onUpdateStatus?: (ticketId: string, status: string) => void;
  onUpdatePriority?: (ticketId: string, priority: string) => void;
}

export function SupportTicketModal({
  ticketId,
  open,
  onClose,
  onAssign,
  onUpdateStatus,
  onUpdatePriority,
}: SupportTicketModalProps) {
  const { data, isLoading } = useTicket(ticketId);
  const { data: cannedResponses } = useCannedResponses();
  const respondMutation = useRespondToTicket();

  const [responseText, setResponseText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [selectedCannedResponse, setSelectedCannedResponse] = useState<string>('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const ticket = data?.ticket;
  const messages = data?.messages || [];

  useEffect(() => {
    if (!open) {
      setResponseText('');
      setIsInternal(false);
      setSelectedCannedResponse('');
    }
  }, [open]);

  const handleCannedResponseSelect = (responseId: string) => {
    const response = cannedResponses?.find((r: CannedResponse) => r._id === responseId);
    if (response) {
      setResponseText(response.content);
      setSelectedCannedResponse(responseId);
    }
  };

  const handleSendResponse = async () => {
    if (!ticketId || !responseText.trim()) return;

    respondMutation.mutate(
      {
        ticketId,
        message: responseText.trim(),
        isInternal,
        cannedResponseId: selectedCannedResponse || undefined,
      },
      {
        onSuccess: () => {
          setResponseText('');
          setIsInternal(false);
          setSelectedCannedResponse('');
        },
      }
    );
  };

  if (!ticket) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Ticket #{ticket.ticketNumber}</span>
              <Badge variant={ticket.status === 'closed' ? 'secondary' : 'default'}>
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{ticket.priority.toUpperCase()}</Badge>
            </DialogTitle>
            <DialogDescription>
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
            {/* Left Column - Ticket Info */}
            <div className="col-span-1 space-y-4 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-sm mb-2">User Information</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={ticket.user.avatar?.url} />
                    <AvatarFallback>
                      {ticket.user.firstName[0]}{ticket.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {ticket.user.firstName} {ticket.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{ticket.user.email}</p>
                    <p className="text-xs text-muted-foreground">{ticket.user.phone}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {ticket.userType === 'customer' ? <User className="h-3 w-3 mr-1" /> : <Building className="h-3 w-3 mr-1" />}
                      {ticket.userType}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">Ticket Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>{' '}
                    <span className="font-medium capitalize">{ticket.category.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subject:</span>{' '}
                    <p className="font-medium mt-1">{ticket.subject}</p>
                  </div>
                  {ticket.relatedOrder && (
                    <div>
                      <span className="text-muted-foreground">Related Order:</span>{' '}
                      <Badge variant="outline" className="mt-1">
                        #{ticket.relatedOrder.orderNumber}
                      </Badge>
                    </div>
                  )}
                  {ticket.assignedTo && (
                    <div>
                      <span className="text-muted-foreground">Assigned To:</span>{' '}
                      <p className="font-medium mt-1">
                        {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">Metrics</h4>
                <div className="space-y-2 text-sm">
                  {ticket.firstResponseAt && (
                    <div>
                      <span className="text-muted-foreground">First Response:</span>{' '}
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(ticket.firstResponseAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                  {ticket.resolutionTime && (
                    <div>
                      <span className="text-muted-foreground">Resolution Time:</span>{' '}
                      <span className="font-medium">{Math.floor(ticket.resolutionTime)} minutes</span>
                    </div>
                  )}
                  {ticket.satisfactionRating && (
                    <div>
                      <span className="text-muted-foreground">Satisfaction:</span>{' '}
                      <span className="font-medium">{ticket.satisfactionRating}/5 ⭐</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Conversation */}
            <div className="col-span-2 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message: TicketMessage) => {
                    const isAdmin = message.senderType === 'admin';
                    const isInternal = message.isInternal;

                    return (
                      <div
                        key={message._id}
                        className={`flex gap-3 ${isInternal ? 'bg-amber-50 p-3 rounded-lg border border-amber-200' : ''}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar?.url} />
                          <AvatarFallback className={isAdmin ? 'bg-primary text-white' : ''}>
                            {message.sender.firstName[0]}{message.sender.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
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
                          <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                          {message.attachments.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {message.attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80"
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
                </div>
              </ScrollArea>

              {/* Response Section */}
              {ticket.status !== 'closed' && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex gap-2">
                    <Select value={selectedCannedResponse} onValueChange={handleCannedResponseSelect}>
                      <SelectTrigger className="w-[240px]">
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

                  <Textarea
                    placeholder="Type your response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={respondMutation.isPending}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files
                    </Button>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!responseText.trim() || respondMutation.isPending}
                      size="sm"
                    >
                      {respondMutation.isPending ? (
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
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-4xl">
          <img src={viewingImage || ''} alt="Attachment" className="w-full h-auto" />
        </DialogContent>
      </Dialog>
    </>
  );
}

