'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { getPlayerDisplayName, getRandomRoast } from '@/lib/utils';

type ViewType = 'golf' | 'challenges' | 'predictions';

export default function LeaderboardPage() {
  const { data, getLeaderboard } = useData();
  const [view, setView] = useState<ViewType>('golf');
  const leaderboard = getLeaderboard();

  const sortedByChallenge = useMemo(() => {
    return [...data.players].sort((a, b) => b.challengePoints - a.challengePoints);
  }, [data.players]);

  const sortedByPrediction = useMemo(() => {
    return [...data.players].sort((a, b) => b.predictionPoints - a.predictionPoints);
  }, [data.players]);

  const displayData = view === 'golf'
    ? leaderboard
    : view === 'challenges'
      ? sortedByChallenge
      : sortedByPrediction;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Leaderboard</h1>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'golf', label: 'Golf', icon: '⛳' },
          { key: 'challenges', label: 'Challenges', icon: '🎯' },
          { key: 'predictions', label: 'Predictions', icon: '🔮' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as ViewType)}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              view === tab.key
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888] hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {displayData.map((player, index) => {
          const isFirst = index === 0;
          const isLast = index === displayData.length - 1;
          const playerData = leaderboard.find(p => p.id === player.id);

          return (
            <div
              key={player.id}
              className={`card relative overflow-hidden ${
                isFirst ? 'border-[#FFD700]' : isLast ? 'border-[#ef4444]/50' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center">
                {isFirst ? (
                  <span className="text-2xl">🏆</span>
                ) : isLast ? (
                  <span className="text-2xl">💩</span>
                ) : (
                  <span className="text-lg font-bold text-[#666666]">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="ml-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {getPlayerDisplayName(player)}
                    </div>
                    {player.nickname && (
                      <div className="text-[#FFD700] text-xs">
                        "{player.nickname}"
                      </div>
                    )}
                  </div>

                  {view === 'golf' && playerData && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {playerData.totalStrokes || '-'}
                      </div>
                      <div className="text-xs text-[#888888]">
                        {playerData.roundsPlayed} round{playerData.roundsPlayed !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  {view === 'challenges' && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#22c55e]">
                        {player.challengePoints}
                      </div>
                      <div className="text-xs text-[#888888]">points</div>
                    </div>
                  )}

                  {view === 'predictions' && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#8b5cf6]">
                        {player.predictionPoints}
                      </div>
                      <div className="text-xs text-[#888888]">points</div>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-2 text-xs text-[#666666]">
                  <span>HCP: {player.handicap}</span>
                  {view === 'golf' && playerData && playerData.todayScore > 0 && (
                    <span>Today: {playerData.todayScore}</span>
                  )}
                  <span className="flex-1 text-right italic truncate">
                    {getRandomRoast()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🏌️</div>
          <p className="text-[#888888]">No data yet. Get out there and play!</p>
        </div>
      )}
    </div>
  );
}
