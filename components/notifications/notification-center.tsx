"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Settings, MessageCircle, Users, Zap, AlertCircle } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications, settings, unreadCount, markAsRead, updateSettings } = useNotifications(userId)
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "match":
        return <Zap className="w-4 h-4 text-green-500" />
      case "connection":
        return <Users className="w-4 h-4 text-purple-500" />
      case "system":
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Tabs defaultValue="notifications" className="w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="notifications" className="p-1">
                <Bell className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="settings" className="p-1">
                <Settings className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="m-0">
            <ScrollArea className="h-96">
              {notifications.length > 0 ? (
                <div className="space-y-1 p-2">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.isRead ? "bg-primary/5 border-primary/20" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.body}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                  <Bell className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={settings?.enablePush || false}
                    onCheckedChange={(checked) => updateSettings({ enablePush: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="message-notifications">New Messages</Label>
                  <Switch
                    id="message-notifications"
                    checked={settings?.enableMessages || false}
                    onCheckedChange={(checked) => updateSettings({ enableMessages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="match-notifications">New Matches</Label>
                  <Switch
                    id="match-notifications"
                    checked={settings?.enableMatches || false}
                    onCheckedChange={(checked) => updateSettings({ enableMatches: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="connection-notifications">Connections</Label>
                  <Switch
                    id="connection-notifications"
                    checked={settings?.enableConnections || false}
                    onCheckedChange={(checked) => updateSettings({ enableConnections: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="system-notifications">System Updates</Label>
                  <Switch
                    id="system-notifications"
                    checked={settings?.enableSystem || false}
                    onCheckedChange={(checked) => updateSettings({ enableSystem: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
