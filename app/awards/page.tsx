'use client';

import { useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { getPlayerDisplayName } from '@/lib/utils';
import { ROUNDS } from '@/lib/constants';

export default function AwardsPage() {
  const { data, getLeaderboard, getPlayerById } = useData();
  const leaderboard = getLeaderboard();

  const awards = useMemo(() => {
    const results: Array<{
      title: string;
      emoji: string;
      winner: string | null;
      value: string;
    }> = [];

    // Trip Champion - Lowest total
    if (leaderboard.length > 0 && leaderboard[0].totalStrokes > 0) {
      results.push({
        title: 'Trip Champion',
        emoji: '🏆',
        winner: getPlayerDisplayName(leaderboard[0]),
        value: `${leaderboard[0].totalStrokes} total`,
      });
    }

    // The Anchor - Highest total
    const playersWithScores = leaderboard.filter((p) => p.roundsPlayed > 0);
    if (playersWithScores.length > 1) {
      const last = playersWithScores[playersWithScores.length - 1];
      results.push({
        title: 'The Anchor',
        emoji: '📉',
        winner: getPlayerDisplayName(last),
        value: `${last.totalStrokes} total`,
      });
    }

    // Challenge King - Most challenge points
    const challengeLeader = [...data.players].sort(
      (a, b) => b.challengePoints - a.challengePoints
    )[0];
    if (challengeLeader.challengePoints > 0) {
      results.push({
        title: 'Challenge King',
        emoji: '🎯',
        winner: getPlayerDisplayName(challengeLeader),
        value: `${challengeLeader.challengePoints} points`,
      });
    }

    // Hot Round - Lowest single round
    if (data.scores.length > 0) {
      const lowestScore = [...data.scores].sort((a, b) => a.total - b.total)[0];
      const player = getPlayerById(lowestScore.playerId);
      const round = ROUNDS.find((r) => r.number === lowestScore.roundNumber);
      results.push({
        title: 'Hot Round',
        emoji: '🔥',
        winner: player ? getPlayerDisplayName(player) : 'Unknown',
        value: `${lowestScore.total} at ${round?.course || 'Unknown'}`,
      });
    }

    // Cold Round - Highest single round
    if (data.scores.length > 0) {
      const highestScore = [...data.scores].sort((a, b) => b.total - a.total)[0];
      const player = getPlayerById(highestScore.playerId);
      const round = ROUNDS.find((r) => r.number === highestScore.roundNumber);
      results.push({
        title: 'Cold Round',
        emoji: '💀',
        winner: player ? getPlayerDisplayName(player) : 'Unknown',
        value: `${highestScore.total} at ${round?.course || 'Unknown'}`,
      });
    }

    // Content Creator - Most photos
    const photoCountByPlayer: Record<string, number> = {};
    data.photos.forEach((photo) => {
      photoCountByPlayer[photo.uploadedBy] = (photoCountByPlayer[photo.uploadedBy] || 0) + 1;
    });
    const photoLeader = Object.entries(photoCountByPlayer).sort(([, a], [, b]) => b - a)[0];
    if (photoLeader) {
      const player = getPlayerById(photoLeader[0]);
      results.push({
        title: 'Content Creator',
        emoji: '📸',
        winner: player ? getPlayerDisplayName(player) : 'Unknown',
        value: `${photoLeader[1]} photos`,
      });
    }

    // Chatterbox - Most chat messages
    const msgCountByPlayer: Record<string, number> = {};
    data.messages.forEach((msg) => {
      msgCountByPlayer[msg.playerId] = (msgCountByPlayer[msg.playerId] || 0) + 1;
    });
    const msgLeader = Object.entries(msgCountByPlayer).sort(([, a], [, b]) => b - a)[0];
    if (msgLeader) {
      const player = getPlayerById(msgLeader[0]);
      results.push({
        title: 'Chatterbox',
        emoji: '💬',
        winner: player ? getPlayerDisplayName(player) : 'Unknown',
        value: `${msgLeader[1]} messages`,
      });
    }

    // Bookie - Most bets created
    const betCountByPlayer: Record<string, number> = {};
    data.bets.forEach((bet) => {
      betCountByPlayer[bet.createdBy] = (betCountByPlayer[bet.createdBy] || 0) + 1;
    });
    const betLeader = Object.entries(betCountByPlayer).sort(([, a], [, b]) => b - a)[0];
    if (betLeader) {
      const player = getPlayerById(betLeader[0]);
      results.push({
        title: 'Bookie',
        emoji: '🎰',
        winner: player ? getPlayerDisplayName(player) : 'Unknown',
        value: `${betLeader[1]} bets created`,
      });
    }

    // The Oracle - Most prediction points
    const oracleLeader = [...data.players].sort(
      (a, b) => b.predictionPoints - a.predictionPoints
    )[0];
    if (oracleLeader.predictionPoints > 0) {
      results.push({
        title: 'The Oracle',
        emoji: '🔮',
        winner: getPlayerDisplayName(oracleLeader),
        value: `${oracleLeader.predictionPoints} points`,
      });
    }

    return results;
  }, [data, leaderboard, getPlayerById]);

  const superlatives = [
    { title: 'Best Dressed', emoji: '👔' },
    { title: 'Worst Excuses', emoji: '🤥' },
    { title: 'Most Likely to Cheat', emoji: '🃏' },
    { title: 'Best Attitude About Losing', emoji: '😊' },
    { title: 'Loudest on the Course', emoji: '📢' },
    { title: 'Best Golf Outfit', emoji: '👕' },
    { title: 'Worst Golf Outfit', emoji: '👖' },
    { title: 'Most Likely to Blame Equipment', emoji: '🏌️' },
    { title: 'MVP', emoji: '⭐' },
    { title: 'LVP (with love)', emoji: '💝' },
  ];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-5xl">🏅</span>
        <h1 className="text-2xl font-bold text-white mt-2">Awards</h1>
        <p className="text-[#888888] text-sm">End of trip ceremony</p>
      </div>

      {/* Auto-Calculated Awards */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-4">Stats-Based Awards</h2>
        {awards.length > 0 ? (
          <div className="space-y-3">
            {awards.map((award, idx) => (
              <div key={idx} className="card flex items-center gap-4">
                <span className="text-3xl">{award.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{award.title}</div>
                  <div className="text-[#888888] text-sm">{award.value}</div>
                </div>
                <div className="text-[#FFD700] font-bold text-right">
                  {award.winner}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl">📊</span>
            <p className="text-[#888888] mt-2">Awards will appear as data is added</p>
          </div>
        )}
      </div>

      {/* Voteable Superlatives */}
      <div>
        <h2 className="text-white font-semibold mb-4">Vote-Based Superlatives</h2>
        <p className="text-[#666666] text-sm mb-4">Coming soon - vote at the end of the trip!</p>
        <div className="grid grid-cols-2 gap-3">
          {superlatives.map((sup, idx) => (
            <div
              key={idx}
              className="card text-center py-6 opacity-50"
            >
              <span className="text-2xl block mb-2">{sup.emoji}</span>
              <div className="text-[#888888] text-sm">{sup.title}</div>
              <div className="text-[#666666] text-xs mt-1">TBD</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
