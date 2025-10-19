'use client';

import { useState } from 'react';
import {
  useCannedResponses,
  useCreateCannedResponse,
  useUpdateCannedResponse,
  useDeleteCannedResponse,
} from '@/hooks/queries/useSupportQueries';
import { CannedResponse } from '@/types/support';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'order_issue', label: 'Order Issues' },
  { value: 'payment_issue', label: 'Payment Issues' },
  { value: 'account_issue', label: 'Account Issues' },
  { value: 'kyc_issue', label: 'KYC Issues' },
  { value: 'general_inquiry', label: 'General Inquiries' },
];

export default function CannedResponsesPage() {
  const { data: responses, isLoading } = useCannedResponses();
  const createMutation = useCreateCannedResponse();
  const updateMutation = useUpdateCannedResponse();
  const deleteMutation = useDeleteCannedResponse();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general_inquiry',
    shortcut: '',
  });

  const handleCreate = () => {
    if (!formData.title || !formData.content || !formData.shortcut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.shortcut.startsWith('/')) {
      toast.error('Shortcut must start with /');
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({ title: '', content: '', category: 'general_inquiry', shortcut: '' });
      },
    });
  };

  const handleUpdate = () => {
    if (!editingResponse) return;

    updateMutation.mutate(
      {
        responseId: editingResponse._id,
        data: formData,
      },
      {
        onSuccess: () => {
          setEditingResponse(null);
          setFormData({ title: '', content: '', category: 'general_inquiry', shortcut: '' });
        },
      }
    );
  };

  const handleDelete = (responseId: string) => {
    if (confirm('Are you sure you want to delete this canned response?')) {
      deleteMutation.mutate(responseId);
    }
  };

  const handleEdit = (response: CannedResponse) => {
    setEditingResponse(response);
    setFormData({
      title: response.title,
      content: response.content,
      category: response.category,
      shortcut: response.shortcut,
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Response copied to clipboard');
  };

  const groupedResponses = responses?.reduce((acc: Record<string, CannedResponse[]>, response: CannedResponse) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground">Quick response templates for common support issues</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Response
        </Button>
      </div>

      {/* Responses by Category */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((category) => {
            const categoryResponses = groupedResponses[category.value] || [];
            if (categoryResponses.length === 0) return null;

            return (
              <div key={category.value}>
                <h2 className="text-xl font-semibold mb-4">{category.label}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryResponses.map((response: CannedResponse) => (
                    <Card key={response._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span>{response.title}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {response.shortcut}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Used {response.usageCount} times
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {response.content}
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(response.content)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(response)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(response._id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || !!editingResponse}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingResponse(null);
            setFormData({ title: '', content: '', category: 'general_inquiry', shortcut: '' });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingResponse ? 'Edit' : 'Create'} Canned Response</DialogTitle>
            <DialogDescription>
              {editingResponse ? 'Update the canned response details' : 'Create a quick response template'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Order delay explanation"
              />
            </div>

            <div>
              <Label htmlFor="shortcut">Shortcut *</Label>
              <Input
                id="shortcut"
                value={formData.shortcut}
                onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
                placeholder="/order-delay"
                disabled={!!editingResponse}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must start with / and contain only lowercase letters, numbers, and hyphens
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Thank you for contacting us. We're looking into your order delay..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingResponse(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingResponse ? handleUpdate : handleCreate}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingResponse ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{editingResponse ? 'Update' : 'Create'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

