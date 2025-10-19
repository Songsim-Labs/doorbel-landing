'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { notificationApi, Notification } from '@/lib/notification-api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [activeTab, page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications(
        page,
        20,
        activeTab === 'unread'
      );
      setNotifications(response.notifications || []);
      setHasMore(response.hasMorePages || false);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications. Please check your connection.');
      setNotifications([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_update':
        return '📦';
      case 'payment':
        return '💰';
      case 'kyc':
        return '📄';
      case 'system':
        return '⚙️';
      case 'promotion':
        return '🎁';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order_update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'payment':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'kyc':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'system':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'promotion':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification._id}
      className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
        !notification.isRead ? 'bg-green-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border ${getNotificationColor(
            notification.type
          )}`}
        >
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {notification.type.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with important events and updates
          </p>
        </div>
        <Button onClick={handleMarkAllAsRead} variant="outline">
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'all' | 'unread');
        setPage(1);
      }}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            {loading ? (
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-muted-foreground mt-4">Loading notifications...</p>
              </CardContent>
            ) : notifications.length === 0 ? (
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">No notifications</p>
              </CardContent>
            ) : (
              <div>
                {notifications.map(renderNotification)}
                {hasMore && (
                  <div className="p-4 text-center border-t">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <Card>
            {loading ? (
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-muted-foreground mt-4">Loading notifications...</p>
              </CardContent>
            ) : notifications.length === 0 ? (
              <CardContent className="p-8 text-center">
                <CheckCheck className="h-12 w-12 mx-auto text-green-500" />
                <p className="text-muted-foreground mt-4">You&apos;re all caught up!</p>
                <p className="text-sm text-muted-foreground mt-2">No unread notifications</p>
              </CardContent>
            ) : (
              <div>
                {notifications.map(renderNotification)}
                {hasMore && (
                  <div className="p-4 text-center border-t">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

