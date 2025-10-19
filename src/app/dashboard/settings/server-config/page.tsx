'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Trash2, Eye, EyeOff, Download, RefreshCw } from 'lucide-react';

interface ServerConfig {
  _id: string;
  key: string;
  value: string | number | boolean;
  category: 'email' | 'pricing' | 'sms' | 'payment' | 'general';
  description?: string;
  isEncrypted: boolean;
  isActive: boolean;
  lastUpdatedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CONFIG_DEFINITIONS = {
  email: [
    { key: 'RESEND_API_KEY', label: 'Resend API Key', type: 'password', description: 'Resend email service API key', isEncrypted: true },
    { key: 'EMAIL_FROM', label: 'From Email', type: 'email', description: 'Sender email address' },
  ],
  pricing: [
    { key: 'DELIVERY_BASE_RATE', label: 'Base Delivery Rate (GHS)', type: 'number', description: 'Base delivery fee' },
    { key: 'DELIVERY_PER_KM_RATE', label: 'Per KM Rate (GHS)', type: 'number', description: 'Price per kilometer' },
    { key: 'PLATFORM_FEE_RATE', label: 'Platform Fee Rate', type: 'number', description: 'Platform fee percentage (0.15 = 15%)' },
    { key: 'SERVICE_CHARGE_RATE', label: 'Service Charge Rate', type: 'number', description: 'Service charge percentage (0.10 = 10%)' },
  ],
  sms: [
    { key: 'ARKESEL_API_KEY', label: 'Arkesel API Key', type: 'password', description: 'SMS service API key', isEncrypted: true },
    { key: 'ARKESEL_SENDER_ID', label: 'SMS Sender ID', type: 'text', description: 'SMS sender name' },
  ],
  payment: [
    { key: 'PAYSTACK_SECRET_KEY', label: 'Paystack Secret Key', type: 'password', description: 'Paystack secret key', isEncrypted: true },
    { key: 'PAYSTACK_PUBLIC_KEY', label: 'Paystack Public Key', type: 'text', description: 'Paystack public key' },
  ],
};

export default function ServerConfigPage() {
  const [configs, setConfigs] = useState<ServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingConfig, setEditingConfig] = useState<{
    key: string;
    value: string;
    category: string;
    description?: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [deleteConfig, setDeleteConfig] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getServerConfigs();
      setConfigs(data || []);
    } catch (error: any) {
      console.error('Failed to load configs:', error);
      toast.error('Failed to load server configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!editingConfig) return;

    try {
      setSaving(true);
      await apiClient.updateServerConfig(
        editingConfig.key,
        editingConfig.value,
        editingConfig.category,
        editingConfig.description
      );
      
      toast.success('Configuration updated successfully');
      setEditingConfig(null);
      await loadConfigs();
      
      // Clear cache after update
      await apiClient.clearConfigCache();
    } catch (error: any) {
      console.error('Failed to save config:', error);
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (key: string) => {
    try {
      await apiClient.deleteServerConfig(key);
      toast.success('Configuration deleted successfully');
      setDeleteConfig(null);
      await loadConfigs();
      await apiClient.clearConfigCache();
    } catch (error: any) {
      console.error('Failed to delete config:', error);
      toast.error('Failed to delete configuration');
    }
  };

  const handleImportFromEnv = async () => {
    try {
      setSaving(true);
      const result = await apiClient.importConfigsFromEnv();
      toast.success(`Import completed! Success: ${result.success}, Failed: ${result.failed}`);
      setImportDialogOpen(false);
      await loadConfigs();
    } catch (error: any) {
      console.error('Failed to import configs:', error);
      toast.error('Failed to import configurations from .env');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await apiClient.clearConfigCache();
      toast.success('Configuration cache cleared successfully');
    } catch (error: any) {
      console.error('Failed to clear cache:', error);
      toast.error('Failed to clear cache');
    }
  };

  const getConfigValue = (key: string): string => {
    const config = configs.find(c => c.key === key);
    return config ? String(config.value) : '';
  };

  const renderConfigField = (def: any, category: string) => {
    const value = getConfigValue(def.key);
    const isPassword = def.type === 'password';
    const showValue = showPassword[def.key];
    const hasValue = !!value && value !== '********';

    return (
      <div key={def.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={def.key} className="text-sm font-medium">
            {def.label}
            {def.isEncrypted && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Encrypted
              </Badge>
            )}
          </Label>
          <div className="flex gap-2">
            {isPassword && hasValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(prev => ({ ...prev, [def.key]: !showValue }))}
              >
                {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setEditingConfig({
                  key: def.key,
                  value: value && value !== '********' ? value : '',
                  category,
                  description: def.description,
                })
              }
            >
              Edit
            </Button>
          </div>
        </div>
        <Input
          id={def.key}
          type={isPassword && !showValue ? 'password' : def.type}
          value={value}
          readOnly
          className="bg-muted"
        />
        {def.description && (
          <p className="text-xs text-muted-foreground">{def.description}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Server Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Manage email, pricing, SMS, and payment settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearCache}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Import from .env
          </Button>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure Resend API for sending emails (modern alternative to SMTP)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONFIG_DEFINITIONS.email.map(def => renderConfigField(def, 'email'))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>
                Configure delivery rates and service charges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONFIG_DEFINITIONS.pricing.map(def => renderConfigField(def, 'pricing'))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>
                Configure Arkesel SMS service settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONFIG_DEFINITIONS.sms.map(def => renderConfigField(def, 'sms'))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure Paystack payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONFIG_DEFINITIONS.payment.map(def => renderConfigField(def, 'payment'))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Configuration Dialog */}
      <Dialog open={!!editingConfig} onOpenChange={(open) => !open && setEditingConfig(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Configuration</DialogTitle>
            <DialogDescription>
              Update the configuration value. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          {editingConfig && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key</Label>
                <Input value={editingConfig.key} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={editingConfig.value}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, value: e.target.value })
                  }
                  placeholder="Enter new value"
                />
              </div>
              {editingConfig.description && (
                <p className="text-sm text-muted-foreground">{editingConfig.description}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingConfig(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import from .env file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will import all configurable settings from your .env file into the database.
              Existing configurations will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportFromEnv} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfig} onOpenChange={(open) => !open && setDeleteConfig(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the configuration. The system will fall back to .env values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfig && handleDeleteConfig(deleteConfig)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

