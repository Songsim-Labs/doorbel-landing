'use client';

import { useState } from 'react';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { useSendCampaign, useCampaignStats } from '@/hooks/queries/useCampaignQueries';
import { emailTemplates } from '@/lib/emailTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Eye,
  Save,
  Loader2,
  Mail,
  Users,
  Target,
  FileText,
  ArrowLeft,
  TestTube,
  Paintbrush,
  Settings2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CampaignBuilderPage() {
  const router = useRouter();
  const { data: statsData } = useCampaignStats();
  const sendCampaignMutation = useSendCampaign();

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('<p>Hello {{firstName}},</p><p>We have an exciting update for you!</p>');
  const [selectedTemplate, setSelectedTemplate] = useState('marketing');
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  // Custom template settings
  const [customSettings, setCustomSettings] = useState({
    headerColor: '#22c55e',
    textColor: '#333333',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    includeHeader: false,
    includeFooter: true,
    headerText: 'DoorBel',
    footerText: 'Best regards, The DoorBel Team',
  });
  
  // Audience targeting
  const [targetCities, setTargetCities] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [targetStatus, setTargetStatus] = useState<string[]>(['confirmed']);
  const [marketingOptInOnly, setMarketingOptInOnly] = useState(true);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  const cities = ['accra', 'kumasi', 'takoradi', 'tamale', 'cape-coast', 'koforidua', 'sunyani', 'ho', 'bolgatanga', 'wa', 'other'];
  const roles = ['customer', 'rider', 'both'];
  const statuses = ['pending', 'confirmed', 'launched'];

  const loadTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setIsCustomMode(template.isCustom || false);
      
      if (templateId === 'custom') {
        setSubject('');
        setContent('<p>Start writing your email here...</p><p>You have full creative control!</p>');
      } else {
        if (template.subject) {
          setSubject(template.subject.replace(/\{\{subject\}\}/g, ''));
        }
        // Extract content from template
        const contentMatch = template.html.match(/\{\{content\}\}/) 
          ? '<p>Your custom content here...</p>'
          : template.html;
        setContent(contentMatch);
      }
    }
  };

  const getAudienceCount = () => {
    if (!statsData) return 0;
    
    // Simple estimate based on stats
    let count = statsData.total;
    
    if (targetStatus.length > 0) {
      count = targetStatus.reduce((sum, status) => {
        if (status === 'pending') return sum + (statsData.total - statsData.confirmed - statsData.launched);
        if (status === 'confirmed') return sum + statsData.confirmed;
        if (status === 'launched') return sum + statsData.launched;
        return sum;
      }, 0);
    }
    
    if (marketingOptInOnly) {
      count = Math.min(count, statsData.marketingOptIn);
    }
    
    return count;
  };

  const handleSendCampaign = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }
    
    if (!content.trim() || content === '<p></p>') {
      toast.error('Please enter email content');
      return;
    }

    if (getAudienceCount() === 0) {
      toast.error('No recipients match your targeting criteria');
      return;
    }

    if (!confirm(`Send campaign to ${getAudienceCount()} recipients?`)) {
      return;
    }

    sendCampaignMutation.mutate({
      type: 'marketing',
      subject,
      content,
      templateId: selectedTemplate,
      targetAudience: {
        cities: targetCities.length > 0 ? targetCities : undefined,
        roles: targetRoles.length > 0 ? targetRoles : undefined,
        status: targetStatus.length > 0 ? targetStatus : undefined,
      }
    }, {
      onSuccess: () => {
        // Reset form
        setSubject('');
        setContent('<p>Hello {{firstName}},</p><p>We have an exciting update for you!</p>');
        setTargetCities([]);
        setTargetRoles([]);
        setTargetStatus(['confirmed']);
      }
    });
  };

  const handleTestSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Please enter subject and content');
      return;
    }

    // This would send a test email to the admin's email
    toast.info('Test send feature coming soon!');
  };

  const getPreviewHTML = () => {
    const template = emailTemplates.find(t => t.id === selectedTemplate);
    if (!template) return content;

    if (isCustomMode) {
      // Build custom HTML with settings
      const customHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              font-family: ${customSettings.fontFamily}; 
              line-height: 1.6; 
              color: ${customSettings.textColor}; 
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: ${customSettings.backgroundColor};
            }
            .header { 
              background: ${customSettings.headerColor}; 
              color: white; 
              padding: 30px; 
              text-align: center; 
            }
            .content { 
              padding: 40px 30px;
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px; 
              text-align: center; 
              color: #666; 
              font-size: 14px; 
              border-top: 1px solid #e5e7eb;
            }
            .button { 
              display: inline-block; 
              background: ${customSettings.headerColor}; 
              color: white !important; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 10px 0; 
            }
            h1, h2, h3 { color: ${customSettings.headerColor}; }
            a { color: ${customSettings.headerColor}; }
          </style>
        </head>
        <body>
          <div class="container">
            ${customSettings.includeHeader ? `<div class="header"><h1>${customSettings.headerText}</h1></div>` : ''}
            <div class="content">
              ${content}
            </div>
            ${customSettings.includeFooter ? `<div class="footer"><p>${customSettings.footerText}</p><p><small>🇬🇭 Building Ghana's #1 Delivery Platform</small></p></div>` : ''}
          </div>
        </body>
        </html>
      `;
      return customHTML
        .replace(/\{\{firstName\}\}/g, 'John')
        .replace(/\{\{lastName\}\}/g, 'Doe')
        .replace(/\{\{city\}\}/g, 'Accra')
        .replace(/\{\{referralCode\}\}/g, 'DBTEST123');
    }

    return template.html
      .replace(/\{\{subject\}\}/g, subject)
      .replace(/\{\{content\}\}/g, content)
      .replace(/\{\{firstName\}\}/g, 'John')
      .replace(/\{\{lastName\}\}/g, 'Doe')
      .replace(/\{\{city\}\}/g, 'Accra')
      .replace(/\{\{referralCode\}\}/g, 'DBTEST123');
  };

  // Extract just the body content for preview rendering
  const getPreviewBody = () => {
    const fullHTML = getPreviewHTML();
    const bodyMatch = fullHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const styleMatch = fullHTML.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    
    if (bodyMatch && styleMatch) {
      // Modify styles to make container full-width in preview
      let modifiedStyles = styleMatch[1];
      // Remove max-width constraint from container for preview
      modifiedStyles = modifiedStyles.replace(/max-width:\s*600px;?/gi, 'max-width: 100%;');
      // Ensure container takes full width
      modifiedStyles = modifiedStyles.replace(/\.container\s*{([^}]*)}/, '.container { $1 width: 100%; }');
      
      return `<style>${modifiedStyles}</style>${bodyMatch[1]}`;
    }
    return fullHTML;
  };

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/dashboard/campaigns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Campaign Builder
          </h1>
          <p className="text-sm text-muted-foreground">Create and send marketing emails to your waitlist</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTestSend}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Send
          </Button>
          <Button 
            size="sm"
            onClick={handleSendCampaign} 
            disabled={sendCampaignMutation.isPending} 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          >
            {sendCampaignMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Campaign
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Editor Section */}
        <div className="flex-1 lg:flex-[2] space-y-4 min-w-0">
          {/* Email Content */}
          <Card className="shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Mail className="h-4 w-4 mr-2" />
                Email Content
              </CardTitle>
              <CardDescription className="text-sm">Compose your email message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
              {/* Template Selector */}
              <div>
                <Label>Email Template</Label>
                <Select value={selectedTemplate} onValueChange={loadTemplate}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          {template.isCustom && <Paintbrush className="h-4 w-4" />}
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {emailTemplates.find(t => t.id === selectedTemplate)?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {emailTemplates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>

              {/* Custom Settings Panel */}
              {isCustomMode && (
                <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-900">Custom Template Settings</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Header Options */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-header"
                          checked={customSettings.includeHeader}
                          onCheckedChange={(checked) => 
                            setCustomSettings({...customSettings, includeHeader: checked as boolean})
                          }
                        />
                        <Label htmlFor="include-header" className="text-sm">Include Header</Label>
                      </div>
                      
                      {customSettings.includeHeader && (
                        <Input
                          value={customSettings.headerText}
                          onChange={(e) => setCustomSettings({...customSettings, headerText: e.target.value})}
                          placeholder="Header text..."
                          className="text-sm"
                        />
                      )}
                    </div>

                    {/* Footer Options */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-footer"
                          checked={customSettings.includeFooter}
                          onCheckedChange={(checked) => 
                            setCustomSettings({...customSettings, includeFooter: checked as boolean})
                          }
                        />
                        <Label htmlFor="include-footer" className="text-sm">Include Footer</Label>
                      </div>
                      
                      {customSettings.includeFooter && (
                        <Input
                          value={customSettings.footerText}
                          onChange={(e) => setCustomSettings({...customSettings, footerText: e.target.value})}
                          placeholder="Footer text..."
                          className="text-sm"
                        />
                      )}
                    </div>

                    {/* Color Customization */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="header-color" className="text-xs">Header Color</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="header-color"
                            type="color"
                            value={customSettings.headerColor}
                            onChange={(e) => setCustomSettings({...customSettings, headerColor: e.target.value})}
                            className="h-9 w-16 p-1"
                          />
                          <Input
                            value={customSettings.headerColor}
                            onChange={(e) => setCustomSettings({...customSettings, headerColor: e.target.value})}
                            className="flex-1 h-9 text-xs"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bg-color" className="text-xs">Background</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="bg-color"
                            type="color"
                            value={customSettings.backgroundColor}
                            onChange={(e) => setCustomSettings({...customSettings, backgroundColor: e.target.value})}
                            className="h-9 w-16 p-1"
                          />
                          <Input
                            value={customSettings.backgroundColor}
                            onChange={(e) => setCustomSettings({...customSettings, backgroundColor: e.target.value})}
                            className="flex-1 h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                      <Select 
                        value={customSettings.fontFamily} 
                        onValueChange={(value) => setCustomSettings({...customSettings, fontFamily: value})}
                      >
                        <SelectTrigger className="mt-1 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                          <SelectItem value="Georgia, serif">Georgia</SelectItem>
                          <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                          <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                          <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                          <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Line */}
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="mt-1"
                />
              </div>

              {/* WYSIWYG Editor */}
              <div>
                <Label>Email Body</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Use variables: <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">{`{{firstName}}`}</code>, <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">{`{{lastName}}`}</code>, <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">{`{{city}}`}</code>
                </p>
                <div className="mt-1">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your email content here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </CardTitle>
              <CardDescription className="text-sm">See how your email will look</CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Tabs defaultValue="rendered" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="rendered" className="text-sm">Rendered</TabsTrigger>
                  <TabsTrigger value="html" className="text-sm">HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="rendered" className="mt-0 w-full min-w-0">
                  <div className="w-full border rounded-md bg-gray-200 p-6 max-h-[500px] overflow-auto">
                    <div 
                      className="email-preview-content w-full min-w-0"
                      dangerouslySetInnerHTML={{ __html: getPreviewBody() }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="html" className="mt-0 w-full min-w-0">
                  <div className="w-full border rounded-md bg-gray-900">
                    <pre className="p-4 text-xs overflow-auto max-h-[500px] text-green-400 whitespace-pre-wrap break-words">
                      <code>{getPreviewHTML()}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Targeting */}
        <div className="flex-1 lg:flex-[1] space-y-4 min-w-0 lg:min-w-[300px]">
          {/* Audience Targeting */}
          <Card className="shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Target className="h-4 w-4 mr-2" />
                Audience Targeting
              </CardTitle>
              <CardDescription className="text-sm">
                Select who will receive this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Filter */}
              <div>
                <Label className="mb-2 block">User Status</Label>
                <div className="space-y-2">
                  {statuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={targetStatus.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetStatus([...targetStatus, status]);
                          } else {
                            setTargetStatus(targetStatus.filter(s => s !== status));
                          }
                        }}
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <Label className="mb-2 block">User Role</Label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={targetRoles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetRoles([...targetRoles, role]);
                          } else {
                            setTargetRoles(targetRoles.filter(r => r !== role));
                          }
                        }}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <Label className="mb-2 block">Cities (Optional)</Label>
                <Select
                  value={targetCities.length > 0 ? targetCities[0] : 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setTargetCities([]);
                    } else if (!targetCities.includes(value)) {
                      setTargetCities([...targetCities, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cities..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {targetCities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {targetCities.map(city => (
                      <Badge
                        key={city}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setTargetCities(targetCities.filter(c => c !== city))}
                      >
                        {city.charAt(0).toUpperCase() + city.slice(1)} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Marketing Opt-in */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing-only"
                  checked={marketingOptInOnly}
                  onCheckedChange={(checked) => setMarketingOptInOnly(checked as boolean)}
                />
                <label
                  htmlFor="marketing-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Marketing opt-in users only
                </label>
              </div>

              {/* Audience Count */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Recipients</span>
                  <Badge variant="outline" className="text-base px-3 py-1 border-green-300 bg-green-50 text-green-700 font-semibold">
                    <Users className="h-4 w-4 mr-1" />
                    {getAudienceCount()}
                  </Badge>
                </div>
                {getAudienceCount() === 0 && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ No recipients match your criteria
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Waitlist Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-medium">{statsData?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confirmed</span>
                <span className="font-medium">{statsData?.confirmed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Launched</span>
                <span className="font-medium">{statsData?.launched || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marketing Opt-in</span>
                <span className="font-medium">{statsData?.marketingOptIn || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50/50 border-blue-200 shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                💡 Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-blue-800">
              <p>• Use personalization variables for better engagement</p>
              <p>• Keep subject lines under 50 characters</p>
              <p>• Test send before sending to all recipients</p>
              <p>• Include a clear call-to-action</p>
              <p>• Respect marketing opt-in preferences</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

