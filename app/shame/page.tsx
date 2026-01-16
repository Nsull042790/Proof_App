'use client';

import { useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { getPlayerDisplayName } from '@/lib/utils';
import { ROUNDS } from '@/lib/constants';

export default function ShamePage() {
  const { data, getPlayerById } = useData();

  // Helper to safely get player name
  const getPlayerName = (playerId: string) => {
    const player = getPlayerById(playerId);
    return player ? getPlayerDisplayName(player) : 'Unknown';
  };

  const shameBoard = useMemo(() => {
    const entries: Array<{
      title: string;
      emoji: string;
      player: string;
      detail: string;
      severity: 'mild' | 'medium' | 'severe';
    }> = [];

    // Highest single round
    if (data.scores.length > 0) {
      const worstRound = [...data.scores].sort((a, b) => b.total - a.total)[0];
      const player = getPlayerById(worstRound.playerId);
      const round = ROUNDS.find((r) => r.number === worstRound.roundNumber);
      entries.push({
        title: 'Worst Single Round',
        emoji: '💀',
        player: player ? getPlayerDisplayName(player) : 'Unknown',
        detail: `Shot ${worstRound.total} at ${round?.course || 'Unknown'}`,
        severity: 'severe',
      });
    }

    // Player with most scores over 100
    const over100Counts: Record<string, number> = {};
    data.scores.forEach((score) => {
      if (score.total > 100) {
        over100Counts[score.playerId] = (over100Counts[score.playerId] || 0) + 1;
      }
    });
    const over100Leader = Object.entries(over100Counts).sort(([, a], [, b]) => b - a)[0];
    if (over100Leader && over100Leader[1] > 0) {
      const player = getPlayerById(over100Leader[0]);
      entries.push({
        title: 'Triple Digit Club President',
        emoji: '💯',
        player: player ? getPlayerDisplayName(player) : 'Unknown',
        detail: `${over100Leader[1]} round${over100Leader[1] > 1 ? 's' : ''} over 100`,
        severity: 'severe',
      });
    }

    // Most challenges failed (claimed but disputed)
    const failedChallenges = data.challenges.filter(
      (c) => c.status === 'open' && c.disputedBy.length >= 3
    );
    if (failedChallenges.length > 0) {
      entries.push({
        title: 'All Talk',
        emoji: '🧢',
        player: 'Multiple Players',
        detail: `${failedChallenges.length} challenges disputed into oblivion`,
        severity: 'medium',
      });
    }

    // Player with worst score differential vs handicap
    const worstDifferential = data.scores.reduce(
      (worst, score) => {
        const player = getPlayerById(score.playerId);
        if (!player) return worst;
        const expectedScore = 72 + player.handicap;
        const differential = score.total - expectedScore;
        if (differential > worst.differential) {
          return { playerId: score.playerId, differential, score: score.total, expected: expectedScore };
        }
        return worst;
      },
      { playerId: '', differential: -999, score: 0, expected: 0 }
    );
    if (worstDifferential.playerId && worstDifferential.differential > 0) {
      const player = getPlayerById(worstDifferential.playerId);
      entries.push({
        title: 'Handicap Fraud',
        emoji: '📈',
        player: player ? getPlayerDisplayName(player) : 'Unknown',
        detail: `Shot ${worstDifferential.score} (${worstDifferential.differential > 0 ? '+' : ''}${worstDifferential.differential} vs expected ${worstDifferential.expected})`,
        severity: 'medium',
      });
    }

    // Most quoted (said embarrassing things)
    const quoteCountByPlayer: Record<string, number> = {};
    data.quotes.forEach((quote) => {
      quoteCountByPlayer[quote.saidBy] = (quoteCountByPlayer[quote.saidBy] || 0) + 1;
    });
    const quoteLeader = Object.entries(quoteCountByPlayer).sort(([, a], [, b]) => b - a)[0];
    if (quoteLeader && quoteLeader[1] >= 2) {
      const player = getPlayerById(quoteLeader[0]);
      entries.push({
        title: 'Foot in Mouth',
        emoji: '🦶',
        player: player ? getPlayerDisplayName(player) : 'Unknown',
        detail: `${quoteLeader[1]} quotes immortalized in the book`,
        severity: 'mild',
      });
    }

    // Most reactions on embarrassing photos
    const embarrassingPhotos = data.photos.filter((p) => p.proofType === 'disaster');
    if (embarrassingPhotos.length > 0) {
      const mostReactedDisaster = [...embarrassingPhotos].sort(
        (a, b) =>
          b.reactions.dead +
          b.reactions.laugh -
          (a.reactions.dead + a.reactions.laugh)
      )[0];
      if (mostReactedDisaster.reactions.dead + mostReactedDisaster.reactions.laugh > 0) {
        entries.push({
          title: 'Viral Failure',
          emoji: '📸',
          player: mostReactedDisaster.taggedPlayers.length > 0
            ? getPlayerName(mostReactedDisaster.taggedPlayers[0])
            : getPlayerName(mostReactedDisaster.uploadedBy),
          detail: `${mostReactedDisaster.reactions.dead + mostReactedDisaster.reactions.laugh} reactions on their disaster`,
          severity: 'medium',
        });
      }
    }

    // Lost most bets
    const lostBetCounts: Record<string, number> = {};
    data.bets
      .filter((b) => b.status === 'settled' && b.winner)
      .forEach((bet) => {
        bet.playersInvolved.forEach((playerId) => {
          if (playerId !== bet.winner) {
            lostBetCounts[playerId] = (lostBetCounts[playerId] || 0) + 1;
          }
        });
      });
    const lostBetLeader = Object.entries(lostBetCounts).sort(([, a], [, b]) => b - a)[0];
    if (lostBetLeader && lostBetLeader[1] >= 2) {
      const player = getPlayerById(lostBetLeader[0]);
      entries.push({
        title: 'Bad Gambler',
        emoji: '🎰',
        player: player ? getPlayerDisplayName(player) : 'Unknown',
        detail: `Lost ${lostBetLeader[1]} side bets`,
        severity: 'mild',
      });
    }

    return entries;
  }, [data, getPlayerById]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'border-[#ef4444]';
      case 'medium':
        return 'border-[#f59e0b]';
      default:
        return 'border-[#888888]';
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-5xl">😈</span>
        <h1 className="text-2xl font-bold text-white mt-2">Shame Board</h1>
        <p className="text-[#888888] text-sm">The Wall of Infamy</p>
      </div>

      {shameBoard.length > 0 ? (
        <div className="space-y-4">
          {shameBoard.map((entry, idx) => (
            <div
              key={idx}
              className={`card border-l-4 ${getSeverityColor(entry.severity)}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{entry.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{entry.title}</div>
                  <div className="text-[#FFD700] text-sm mt-1">{entry.player}</div>
                  <div className="text-[#888888] text-sm">{entry.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl">😇</span>
          <p className="text-[#888888] mt-4">No shame... yet.</p>
          <p className="text-[#666666] text-sm">
            The wall will populate as embarrassing things happen
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl text-center">
        <p className="text-[#666666] text-xs">
          All shame is given with love. We're all terrible at golf.
        </p>
      </div>
    </div>
  );
}
