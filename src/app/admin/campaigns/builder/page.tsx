"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Send, 
  Eye, 
  ArrowLeft, 
  Users, 
  Target, 
  Calendar,
  Mail,
  FileText,
  Image,
  Link as LinkIcon,
  Type,
  Palette,
  Settings
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CampaignForm {
  name: string;
  subject: string;
  type: 'marketing' | 'launch' | 'welcome' | 'update';
  content: string;
  templateId: string;
  targetAudience: {
    cities: string[];
    roles: string[];
    status: string[];
  };
  scheduledAt?: string;
  isScheduled: boolean;
}

export default function CampaignBuilderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    subject: '',
    type: 'marketing',
    content: '',
    templateId: 'marketing',
    targetAudience: {
      cities: [],
      roles: [],
      status: []
    },
    isScheduled: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    field: string,
    value: string | string[] | boolean
  ) => {
    if (field.startsWith('targetAudience.')) {
      const audienceField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          [audienceField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError("");
  };

  const handleSave = async (sendNow = false) => {
    if (!formData.name || !formData.subject || !formData.content) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.targetAudience.cities.length === 0 && 
        formData.targetAudience.roles.length === 0 && 
        formData.targetAudience.status.length === 0) {
      setError("Please select at least one audience criteria");
      return;
    }

    try {
      if (sendNow) {
        setIsSending(true);
      } else {
        setIsSaving(true);
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          subject: formData.subject,
          content: formData.content,
          templateId: formData.templateId,
          targetAudience: formData.targetAudience,
          isLaunch: formData.type === 'launch',
          ...(formData.isScheduled && formData.scheduledAt && { scheduledAt: formData.scheduledAt })
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (sendNow) {
          router.push('/admin/campaigns');
        } else {
          // Show success message
          setError("");
        }
      } else {
        setError(data.message || 'Failed to save campaign');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
      setIsSending(false);
    }
  };

  const getTemplatePreview = () => {
    const templates = {
      marketing: {
        name: "Marketing Campaign",
        preview: "Custom marketing email with your content"
      },
      launch: {
        name: "Launch Announcement",
        preview: "App launch notification with download links"
      },
      welcome: {
        name: "Welcome Email",
        preview: "Welcome message with referral code and benefits"
      },
      update: {
        name: "Update Notification",
        preview: "Feature updates and app improvements"
      }
    };
    return templates[formData.templateId as keyof typeof templates];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Builder</h1>
            <p className="text-gray-600">Create and customize your email campaign</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isSending}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Now'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Campaign Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="launch">Launch</SelectItem>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <Label htmlFor="template">Email Template</Label>
                <Select value={formData.templateId} onValueChange={(value) => handleInputChange("templateId", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing Template</SelectItem>
                    <SelectItem value="launch">Launch Template</SelectItem>
                    <SelectItem value="welcome">Welcome Template</SelectItem>
                    <SelectItem value="update">Update Template</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {getTemplatePreview().preview}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Email Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Message Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your email content here..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use HTML tags for formatting. Available variables: {'{{firstName}}'}, {'{{city}}'}, {'{{role}}'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scheduled"
                    checked={formData.isScheduled}
                    onCheckedChange={(checked) => handleInputChange("isScheduled", checked)}
                  />
                  <Label htmlFor="scheduled">Schedule for later</Label>
                </div>

                {formData.isScheduled && (
                  <div>
                    <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => handleInputChange("scheduledAt", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audience Targeting */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Audience Targeting
              </CardTitle>
              <CardDescription>
                Select who should receive this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Target Cities</Label>
                <div className="space-y-2 mt-2">
                  {['accra', 'kumasi', 'takoradi', 'tamale'].map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={`city-${city}`}
                        checked={formData.targetAudience.cities.includes(city)}
                        onCheckedChange={(checked) => {
                          const cities = checked
                            ? [...formData.targetAudience.cities, city]
                            : formData.targetAudience.cities.filter(c => c !== city);
                          handleInputChange("targetAudience.cities", cities);
                        }}
                      />
                      <Label htmlFor={`city-${city}`} className="capitalize">
                        {city}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Target Roles</Label>
                <div className="space-y-2 mt-2">
                  {['customer', 'rider', 'both'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={formData.targetAudience.roles.includes(role)}
                        onCheckedChange={(checked) => {
                          const roles = checked
                            ? [...formData.targetAudience.roles, role]
                            : formData.targetAudience.roles.filter(r => r !== role);
                          handleInputChange("targetAudience.roles", roles);
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Target Status</Label>
                <div className="space-y-2 mt-2">
                  {['pending', 'confirmed', 'launched'].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={formData.targetAudience.status.includes(status)}
                        onCheckedChange={(checked) => {
                          const statuses = checked
                            ? [...formData.targetAudience.status, status]
                            : formData.targetAudience.status.filter(s => s !== status);
                          handleInputChange("targetAudience.status", statuses);
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="capitalize">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {formData.subject || 'No subject'}
                  </div>
                  <div className="text-sm">
                    <strong>Content:</strong>
                    <div className="mt-2 p-3 bg-white rounded border">
                      {formData.content || 'No content'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
