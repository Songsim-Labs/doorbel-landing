'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Trophy, Medal } from 'lucide-react';

interface RiderPerformance {
  _id: string;
  name: string;
  avatar?: string;
  orders: number;
  rating: number;
  earnings: number;
}

interface RiderLeaderboardProps {
  riders: RiderPerformance[];
}

export function RiderLeaderboard({ riders }: RiderLeaderboardProps) {
  const topRiders = riders.slice(0, 10);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Riders</CardTitle>
        <CardDescription>Best riders by orders and rating</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRiders.map((rider, index) => (
            <div
              key={rider._id}
              className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={rider.avatar} />
                <AvatarFallback>
                  {rider.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="font-medium">{rider.name}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{rider.orders} orders</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {rider.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-primary">GHS {rider.earnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">earned</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

