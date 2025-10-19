'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { notificationApi, NotificationPreferences, ChannelPreference } from '@/lib/notification-api';
import { toast } from 'sonner';

type PreferenceKey = keyof NotificationPreferences;

interface PreferenceCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  preferences: Array<{
    key: PreferenceKey;
    label: string;
    description: string;
  }>;
}

const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  {
    title: 'Order Updates',
    description: 'Notifications related to order status and management',
    icon: <Bell className="h-5 w-5" />,
    preferences: [
      { key: 'orderCreated', label: 'Order Created', description: 'When a new order is placed' },
      { key: 'orderAssigned', label: 'Rider Assigned', description: 'When a rider is assigned to an order' },
      { key: 'orderAccepted', label: 'Order Accepted', description: 'When rider accepts an order' },
      { key: 'orderPickup', label: 'Pickup Started', description: 'When rider is collecting items' },
      { key: 'orderInTransit', label: 'In Transit', description: 'When order is on the way' },
      { key: 'orderDelivered', label: 'Delivered', description: 'When order is delivered' },
      { key: 'orderCompleted', label: 'Completed', description: 'When order is completed' },
      { key: 'orderCancelled', label: 'Cancelled', description: 'When order is cancelled' },
    ],
  },
  {
    title: 'Payment Notifications',
    description: 'Notifications related to payments and transactions',
    icon: <Mail className="h-5 w-5" />,
    preferences: [
      { key: 'paymentSuccess', label: 'Payment Success', description: 'When payment is successful' },
      { key: 'paymentFailed', label: 'Payment Failed', description: 'When payment fails' },
    ],
  },
  {
    title: 'KYC & Rider Management',
    description: 'Notifications for rider verification and management',
    icon: <Smartphone className="h-5 w-5" />,
    preferences: [
      { key: 'kycSubmitted', label: 'KYC Submitted', description: 'When rider submits KYC documents' },
      { key: 'kycApproved', label: 'KYC Approved', description: 'When KYC is approved' },
      { key: 'kycRejected', label: 'KYC Rejected', description: 'When KYC is rejected' },
    ],
  },
  {
    title: 'System & Marketing',
    description: 'System alerts and promotional notifications',
    icon: <Info className="h-5 w-5" />,
    preferences: [
      { key: 'systemAlert', label: 'System Alerts', description: 'Important system notifications' },
      { key: 'promotions', label: 'Promotions', description: 'Special offers and promotions' },
    ],
  },
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await notificationApi.getPreferences();
      setPreferences(prefs.preferences);
    } catch (error: any) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load notification preferences. Please check your connection.');
      setPreferences(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannel = async (
    preferenceKey: PreferenceKey,
    channelKey: keyof ChannelPreference,
    value: boolean
  ) => {
    if (!preferences) return;

    try {
      setSaving(true);

      // Update local state optimistically
      const updatedPreferences = {
        ...preferences,
        [preferenceKey]: {
          ...preferences[preferenceKey],
          [channelKey]: value,
        },
      };

      setPreferences(updatedPreferences);

      // Update on backend
      await notificationApi.updatePreferences(updatedPreferences);
      
      toast.success('Preferences updated');
    } catch (error: any) {
      console.error('Failed to update preference:', error);
      toast.error('Failed to update preference');
      // Reload preferences on error
      await loadPreferences();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>
            Failed to load notification preferences. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage how you receive notifications for different events
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure your notification preferences for Push notifications, Email, and SMS. 
          You can customize each notification type independently.
        </AlertDescription>
      </Alert>

      {/* Channel Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Choose how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Push</p>
                <p className="text-xs text-muted-foreground">In-app notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">Email notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">SMS</p>
                <p className="text-xs text-muted-foreground">Text messages</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preference Categories */}
      {PREFERENCE_CATEGORIES.map((category) => (
        <Card key={category.title}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {category.icon}
              <div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.preferences.map((pref, index) => (
              <div key={pref.key}>
                {index > 0 && <Separator className="my-4" />}
                <div>
                  <Label className="text-base font-medium">{pref.label}</Label>
                  <p className="text-sm text-muted-foreground mb-3">{pref.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                    {/* Push */}
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${pref.key}-push`} className="text-sm font-normal cursor-pointer">
                          Push
                        </Label>
                      </div>
                      <Switch
                        id={`${pref.key}-push`}
                        checked={preferences[pref.key].push}
                        onCheckedChange={(value) =>
                          handleToggleChannel(pref.key, 'push', value)
                        }
                        disabled={saving}
                      />
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${pref.key}-email`} className="text-sm font-normal cursor-pointer">
                          Email
                        </Label>
                      </div>
                      <Switch
                        id={`${pref.key}-email`}
                        checked={preferences[pref.key].email}
                        onCheckedChange={(value) =>
                          handleToggleChannel(pref.key, 'email', value)
                        }
                        disabled={saving}
                      />
                    </div>

                    {/* SMS */}
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${pref.key}-sms`} className="text-sm font-normal cursor-pointer">
                          SMS
                        </Label>
                      </div>
                      <Switch
                        id={`${pref.key}-sms`}
                        checked={preferences[pref.key].sms}
                        onCheckedChange={(value) =>
                          handleToggleChannel(pref.key, 'sms', value)
                        }
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Save Indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
}

