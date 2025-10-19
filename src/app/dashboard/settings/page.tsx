'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, DollarSign, Settings as SettingsIcon, Bell, User, Server, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const pricingSchema = z.object({
  basePrice: z.number().min(0, 'Base price must be positive'),
  pricePerKm: z.number().min(0, 'Price per km must be positive'),
  platformFeeRate: z.number().min(0).max(1, 'Platform fee must be between 0 and 1'),
  standardMultiplier: z.number().min(0, 'Multiplier must be positive'),
  expressMultiplier: z.number().min(0, 'Multiplier must be positive'),
});

const platformSchema = z.object({
  standardDeliverySpeed: z.number().min(1, 'Speed must be positive'),
  expressDeliverySpeed: z.number().min(1, 'Speed must be positive'),
  autoAssignmentRadius: z.number().min(1, 'Radius must be positive'),
  maxDistanceLimit: z.number().min(1, 'Distance must be positive'),
  orderTimeout: z.number().min(1, 'Timeout must be positive'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PricingForm = z.infer<typeof pricingSchema>;
type PlatformForm = z.infer<typeof platformSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Pricing form
  const {
    register: registerPricing,
    handleSubmit: handleSubmitPricing,
    formState: { errors: pricingErrors },
  } = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      basePrice: 10,
      pricePerKm: 2,
      platformFeeRate: 0.1,
      standardMultiplier: 0,
      expressMultiplier: 0.5,
    },
  });

  // Platform form
  const {
    register: registerPlatform,
    handleSubmit: handleSubmitPlatform,
    formState: { errors: platformErrors },
  } = useForm<PlatformForm>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      standardDeliverySpeed: 40,
      expressDeliverySpeed: 60,
      autoAssignmentRadius: 15,
      maxDistanceLimit: 50,
      orderTimeout: 30,
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSavePricing = async (data: PricingForm) => {
    try {
      setIsSaving(true);
      // API call: await apiClient.updatePricingSettings(data);
      console.log('Saving pricing settings:', data);
      toast.success('Pricing settings saved successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const onSavePlatform = async (data: PlatformForm) => {
    try {
      setIsSaving(true);
      // API call: await apiClient.updatePlatformSettings(data);
      console.log('Saving platform settings:', data);
      toast.success('Platform settings saved successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    try {
      setIsSaving(true);
      // API call: await apiClient.changePassword(data);
      console.log('Changing password:', data.currentPassword.slice(0, 3) + '***');
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="platform">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="server">
            <Server className="h-4 w-4 mr-2" />
            Server
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Pricing Settings */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>
                Configure delivery pricing and platform fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPricing(onSavePricing)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price (GHS)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      {...registerPricing('basePrice', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    {pricingErrors.basePrice && (
                      <p className="text-sm text-destructive">{pricingErrors.basePrice.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Base fee for all deliveries</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerKm">Price per Kilometer (GHS)</Label>
                    <Input
                      id="pricePerKm"
                      type="number"
                      step="0.01"
                      {...registerPricing('pricePerKm', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    {pricingErrors.pricePerKm && (
                      <p className="text-sm text-destructive">{pricingErrors.pricePerKm.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Cost per kilometer traveled</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platformFeeRate">Platform Fee Rate</Label>
                    <Input
                      id="platformFeeRate"
                      type="number"
                      step="0.01"
                      {...registerPricing('platformFeeRate', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    {pricingErrors.platformFeeRate && (
                      <p className="text-sm text-destructive">{pricingErrors.platformFeeRate.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Platform commission (0-1, e.g., 0.1 = 10%)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standardMultiplier">Standard Delivery Multiplier</Label>
                    <Input
                      id="standardMultiplier"
                      type="number"
                      step="0.1"
                      {...registerPricing('standardMultiplier', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">Price multiplier for standard delivery</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expressMultiplier">Express Delivery Multiplier</Label>
                    <Input
                      id="expressMultiplier"
                      type="number"
                      step="0.1"
                      {...registerPricing('expressMultiplier', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">Price multiplier for express delivery</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Pricing Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Settings */}
        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>
                Configure delivery and assignment settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPlatform(onSavePlatform)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="standardDeliverySpeed">Standard Delivery Speed (km/h)</Label>
                    <Input
                      id="standardDeliverySpeed"
                      type="number"
                      {...registerPlatform('standardDeliverySpeed', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    {platformErrors.standardDeliverySpeed && (
                      <p className="text-sm text-destructive">{platformErrors.standardDeliverySpeed.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expressDeliverySpeed">Express Delivery Speed (km/h)</Label>
                    <Input
                      id="expressDeliverySpeed"
                      type="number"
                      {...registerPlatform('expressDeliverySpeed', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    {platformErrors.expressDeliverySpeed && (
                      <p className="text-sm text-destructive">{platformErrors.expressDeliverySpeed.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autoAssignmentRadius">Auto-Assignment Radius (km)</Label>
                    <Input
                      id="autoAssignmentRadius"
                      type="number"
                      {...registerPlatform('autoAssignmentRadius', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">Radius for finding available riders</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDistanceLimit">Maximum Distance Limit (km)</Label>
                    <Input
                      id="maxDistanceLimit"
                      type="number"
                      {...registerPlatform('maxDistanceLimit', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">Maximum delivery distance allowed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderTimeout">Order Timeout (minutes)</Label>
                    <Input
                      id="orderTimeout"
                      type="number"
                      {...registerPlatform('orderTimeout', { valueAsNumber: true })}
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">Auto-cancel pending orders after</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Platform Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Configuration */}
        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>Server Configuration</CardTitle>
              <CardDescription>
                Manage email credentials, SMS settings, payment gateways, and pricing rates dynamically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Server Configuration panel allows you to manage critical platform settings without redeployment:
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Dynamic Pricing</p>
                      <p className="text-sm text-muted-foreground">
                        Update delivery rates, service charges, and platform fees in real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Email & SMS Credentials</p>
                      <p className="text-sm text-muted-foreground">
                        Configure SMTP and Arkesel SMS settings securely
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">
                        Update Paystack API keys and payment settings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Secure & Encrypted</p>
                      <p className="text-sm text-muted-foreground">
                        Sensitive values are encrypted in the database
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• No redeployment needed - changes take effect immediately</li>
                    <li>• Security-critical keys (JWT, MongoDB) remain protected in .env</li>
                    <li>• Automatic fallback to .env if database config not found</li>
                    <li>• Audit trail - track who changed what and when</li>
                    <li>• Import settings from .env file with one click</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href="/dashboard/settings/server-config">
                      <Server className="h-4 w-4 mr-2" />
                      Open Server Configuration Panel
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation Emails</Label>
                    <p className="text-sm text-muted-foreground">Send confirmation when order is created</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Status Updates</Label>
                    <p className="text-sm text-muted-foreground">Email customers on status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Receipts</Label>
                    <p className="text-sm text-muted-foreground">Send payment confirmation emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rider Assignment Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify riders when assigned to orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Configure SMS notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Status SMS</Label>
                    <p className="text-sm text-muted-foreground">Send SMS for critical status updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>OTP Verification SMS</Label>
                    <p className="text-sm text-muted-foreground">Send OTP codes via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Confirmation SMS</Label>
                    <p className="text-sm text-muted-foreground">Send SMS when payment is received</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Admin Profile */}
        <TabsContent value="profile">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your admin account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue={user?.firstName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue={user?.lastName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={user?.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue={user?.phone} disabled />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact support to update your profile information
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your admin account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...registerPassword('currentPassword')}
                      disabled={isSaving}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword('newPassword')}
                      disabled={isSaving}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters with letters and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword')}
                      disabled={isSaving}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
