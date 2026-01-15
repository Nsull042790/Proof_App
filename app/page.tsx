'use client';

import Link from 'next/link';
import { useData } from '@/components/providers/DataProvider';
import { getPlayerDisplayName, formatTimestamp, getRandomRoast } from '@/lib/utils';
import { ROUNDS } from '@/lib/constants';
import { useMemo } from 'react';

export default function HomePage() {
  const { data, getCurrentPlayer, getLeaderboard } = useData();
  const currentPlayer = getCurrentPlayer();
  const leaderboard = getLeaderboard();

  // Get recent activity
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
      icon: string;
    }> = [];

    // Recent photos
    data.photos.slice(0, 3).forEach((photo) => {
      const player = data.players.find((p) => p.id === photo.uploadedBy);
      activities.push({
        id: `photo-${photo.id}`,
        type: 'photo',
        message: `${player ? getPlayerDisplayName(player) : 'Someone'} posted a ${photo.proofType} proof`,
        timestamp: photo.createdAt,
        icon: '📸',
      });
    });

    // Recent scores
    data.scores.slice(-3).forEach((score) => {
      const player = data.players.find((p) => p.id === score.playerId);
      const round = ROUNDS.find((r) => r.number === score.roundNumber);
      activities.push({
        id: `score-${score.id}`,
        type: 'score',
        message: `${player ? getPlayerDisplayName(player) : 'Someone'} shot ${score.total} at ${round?.course || 'Unknown'}`,
        timestamp: score.createdAt,
        icon: '⛳',
      });
    });

    // Recent challenges
    data.challenges
      .filter((c) => c.status === 'verified')
      .slice(0, 3)
      .forEach((challenge) => {
        const player = data.players.find((p) => p.id === challenge.claimedBy);
        activities.push({
          id: `challenge-${challenge.id}`,
          type: 'challenge',
          message: `${player ? getPlayerDisplayName(player) : 'Someone'} completed "${challenge.title}"`,
          timestamp: new Date().toISOString(),
          icon: '🎯',
        });
      });

    // Recent messages
    data.messages.slice(-3).forEach((msg) => {
      const player = data.players.find((p) => p.id === msg.playerId);
      activities.push({
        id: `msg-${msg.id}`,
        type: 'message',
        message: `${player ? getPlayerDisplayName(player) : 'Someone'}: "${msg.content.slice(0, 30)}${msg.content.length > 30 ? '...' : ''}"`,
        timestamp: msg.createdAt,
        icon: '💬',
      });
    });

    // Sort by timestamp and return top 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [data]);

  // Get current player stats
  const myStats = useMemo(() => {
    if (!currentPlayer) return null;

    const myScores = data.scores.filter((s) => s.playerId === currentPlayer.id);
    const totalStrokes = myScores.reduce((sum, s) => sum + s.total, 0);
    const rank = leaderboard.findIndex((p) => p.id === currentPlayer.id) + 1;

    return {
      totalStrokes,
      roundsPlayed: myScores.length,
      rank: rank > 0 ? rank : '-',
      challengePoints: currentPlayer.challengePoints,
    };
  }, [currentPlayer, data.scores, leaderboard]);

  // Get today's schedule
  const todaySchedule = useMemo(() => {
    const today = new Date().getDay();
    // Map day of week to trip day
    const dayMap: Record<number, keyof typeof data.itineraryNotes> = {
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      0: 'sunday',
      1: 'monday',
    };
    const dayKey = dayMap[today] || 'friday'; // Default to friday for demo
    return {
      day: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
      items: data.itineraryNotes[dayKey],
    };
  }, [data.itineraryNotes]);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      {/* Welcome Section */}
      <div>
        {currentPlayer ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">
              What's up, {getPlayerDisplayName(currentPlayer).split(' ')[0]}?
            </h1>
            <p className="text-[#888888] italic text-sm">
              {getRandomRoast()}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome to PROOF</h1>
            <Link
              href="/setup"
              className="text-[#FFD700] text-sm hover:underline"
            >
              Tap here to select your player →
            </Link>
          </>
        )}
      </div>

      {/* Quick Stats */}
      {myStats && (
        <div className="grid grid-cols-4 gap-2">
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-[#FFD700]">
              {myStats.rank}
            </div>
            <div className="text-[10px] text-[#888888] uppercase">Rank</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-white">
              {myStats.totalStrokes || '-'}
            </div>
            <div className="text-[10px] text-[#888888] uppercase">Total</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-white">
              {myStats.roundsPlayed}
            </div>
            <div className="text-[10px] text-[#888888] uppercase">Rounds</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-bold text-[#22c55e]">
              {myStats.challengePoints}
            </div>
            <div className="text-[10px] text-[#888888] uppercase">Points</div>
          </div>
        </div>
      )}

      {/* Activity Ticker */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Live Activity</h2>
          <span className="text-[10px] text-[#888888] uppercase tracking-wider">
            Recent
          </span>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm"
              >
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{activity.message}</p>
                  <p className="text-[#666666] text-xs">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#666666] text-sm italic">
            Nothing happening yet. Be the first to make some noise.
          </p>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">
            {todaySchedule.day}'s Plan
          </h2>
          <Link
            href="/schedule"
            className="text-xs text-[#FFD700] hover:underline"
          >
            Full Schedule →
          </Link>
        </div>

        <div className="space-y-2">
          {todaySchedule.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
              <span className="text-[#888888]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/scores"
          className="card flex items-center gap-3 hover:border-[#FFD700]/50 transition-colors"
        >
          <span className="text-2xl">📝</span>
          <div>
            <div className="text-white font-medium">Enter Scores</div>
            <div className="text-[#666666] text-xs">Log your round</div>
          </div>
        </Link>

        <Link
          href="/challenges"
          className="card flex items-center gap-3 hover:border-[#FFD700]/50 transition-colors"
        >
          <span className="text-2xl">🎯</span>
          <div>
            <div className="text-white font-medium">Challenges</div>
            <div className="text-[#666666] text-xs">{data.challenges.filter(c => c.status === 'open').length} open</div>
          </div>
        </Link>

        <Link
          href="/board"
          className="card flex items-center gap-3 hover:border-[#FFD700]/50 transition-colors"
        >
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-white font-medium">Leaderboard</div>
            <div className="text-[#666666] text-xs">See standings</div>
          </div>
        </Link>

        <Link
          href="/bets"
          className="card flex items-center gap-3 hover:border-[#FFD700]/50 transition-colors"
        >
          <span className="text-2xl">🎰</span>
          <div>
            <div className="text-white font-medium">Side Bets</div>
            <div className="text-[#666666] text-xs">{data.bets.filter(b => b.status === 'open').length} active</div>
          </div>
        </Link>
      </div>

      {/* Setup Prompt if no player selected */}
      {!currentPlayer && (
        <Link
          href="/setup"
          className="block card bg-[#1a472a]/30 border-[#1a472a] text-center py-6"
        >
          <span className="text-3xl block mb-2">⛳</span>
          <div className="text-[#FFD700] font-semibold mb-1">
            Set Up Your Player
          </div>
          <div className="text-[#888888] text-sm">
            Tap here to pick who you are
          </div>
        </Link>
      )}
    </div>
  );
}
