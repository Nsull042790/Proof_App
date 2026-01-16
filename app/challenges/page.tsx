'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { CHALLENGE_CATEGORIES, EMPTY_STATES } from '@/lib/constants';
import { getPlayerDisplayName } from '@/lib/utils';
import { Challenge } from '@/lib/types';

export default function ChallengesPage() {
  const { data, currentPlayerId, claimChallenge, verifyChallenge, disputeChallenge, getPlayerById } = useData();
  const currentPlayer = currentPlayerId ? data.players.find(p => p.id === currentPlayerId) || null : null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'open' | 'claimed' | 'verified'>('open');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const filteredChallenges = useMemo(() => {
    let challenges = data.challenges;

    if (viewMode === 'open') {
      challenges = challenges.filter((c) => c.status === 'open');
    } else if (viewMode === 'claimed') {
      challenges = challenges.filter((c) => c.status === 'claimed');
    } else {
      challenges = challenges.filter((c) => c.status === 'verified');
    }

    if (selectedCategory) {
      challenges = challenges.filter((c) => c.category === selectedCategory);
    }

    return challenges;
  }, [data.challenges, selectedCategory, viewMode]);

  const handleClaim = (challengeId: string) => {
    if (!currentPlayer) return;
    claimChallenge(challengeId, currentPlayer.id);
    setSelectedChallenge(null);
  };

  const handleVerify = (challengeId: string) => {
    if (!currentPlayer) return;
    verifyChallenge(challengeId, currentPlayer.id);
    setSelectedChallenge(null);
  };

  const handleDispute = (challengeId: string) => {
    if (!currentPlayer) return;
    disputeChallenge(challengeId, currentPlayer.id);
    setSelectedChallenge(null);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Challenges</h1>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'open', label: 'Open' },
          { key: 'claimed', label: 'Pending' },
          { key: 'verified', label: 'Done' },
        ].map((mode) => (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key as typeof viewMode)}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
              viewMode === mode.key
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888]'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#1a1a1a] text-[#888888]'
          }`}
        >
          All
        </button>
        {CHALLENGE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888]'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Challenge List */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-[#888888] italic">{EMPTY_STATES.challenges}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChallenges.map((challenge) => {
            const category = CHALLENGE_CATEGORIES.find((c) => c.id === challenge.category);
            const claimer = challenge.claimedBy ? getPlayerById(challenge.claimedBy) : null;

            return (
              <button
                key={challenge.id}
                onClick={() => setSelectedChallenge(challenge)}
                className="card w-full text-left hover:border-[#FFD700]/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{category?.emoji}</span>
                      <span className="text-white font-semibold">{challenge.title}</span>
                    </div>
                    <p className="text-[#888888] text-sm mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666666]">
                      {challenge.proofRequired && <span>📸 Proof</span>}
                      {challenge.witnessRequired && <span>👀 Witness</span>}
                      {claimer && (
                        <span className="text-[#FFD700]">
                          Claimed by {getPlayerDisplayName(claimer)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-[#22c55e]">
                      {challenge.points}
                    </div>
                    <div className="text-[10px] text-[#888888]">pts</div>
                  </div>
                </div>

                {challenge.status === 'claimed' && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center gap-2">
                    <span className="text-xs text-[#888888]">
                      {challenge.verifiedBy.length}/2 verifications
                    </span>
                    <div className="flex-1 h-1 bg-[#2a2a2a] rounded-full">
                      <div
                        className="h-1 bg-[#22c55e] rounded-full transition-all"
                        style={{ width: `${(challenge.verifiedBy.length / 2) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setSelectedChallenge(null)}
          />
          <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
            <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {CHALLENGE_CATEGORIES.find((c) => c.id === selectedChallenge.category)?.emoji}
                    </span>
                    <h2 className="text-xl font-bold text-white">{selectedChallenge.title}</h2>
                  </div>
                  <p className="text-[#888888]">{selectedChallenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#22c55e]">
                    {selectedChallenge.points}
                  </div>
                  <div className="text-xs text-[#888888]">points</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedChallenge.proofRequired && (
                  <span className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm text-[#888888]">
                    📸 Photo proof required
                  </span>
                )}
                {selectedChallenge.witnessRequired && (
                  <span className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm text-[#888888]">
                    👀 Witness required
                  </span>
                )}
              </div>

              {selectedChallenge.status === 'open' && currentPlayer && (
                <button
                  onClick={() => handleClaim(selectedChallenge.id)}
                  className="btn-primary w-full"
                >
                  Claim Challenge
                </button>
              )}

              {selectedChallenge.status === 'claimed' && currentPlayer && (
                <div className="space-y-3">
                  {selectedChallenge.claimedBy && (
                    <div className="text-center text-[#888888] mb-4">
                      Claimed by{' '}
                      <span className="text-[#FFD700]">
                        {getPlayerDisplayName(getPlayerById(selectedChallenge.claimedBy)!)}
                      </span>
                    </div>
                  )}

                  {selectedChallenge.claimedBy !== currentPlayer.id && (
                    <div className="flex gap-3">
                      {!selectedChallenge.verifiedBy.includes(currentPlayer.id) && (
                        <button
                          onClick={() => handleVerify(selectedChallenge.id)}
                          className="btn-primary flex-1"
                        >
                          ✓ Verify
                        </button>
                      )}
                      {!selectedChallenge.disputedBy.includes(currentPlayer.id) && (
                        <button
                          onClick={() => handleDispute(selectedChallenge.id)}
                          className="btn-secondary flex-1"
                        >
                          ✕ Dispute
                        </button>
                      )}
                    </div>
                  )}

                  {selectedChallenge.verifiedBy.length > 0 && (
                    <div className="text-xs text-[#666666] text-center">
                      Verified by:{' '}
                      {selectedChallenge.verifiedBy
                        .map((id) => getPlayerDisplayName(getPlayerById(id)!))
                        .join(', ')}
                    </div>
                  )}
                </div>
              )}

              {selectedChallenge.status === 'verified' && (
                <div className="text-center py-4">
                  <span className="text-4xl">🎉</span>
                  <p className="text-[#22c55e] font-semibold mt-2">Challenge Completed!</p>
                </div>
              )}

              <button
                onClick={() => setSelectedChallenge(null)}
                className="btn-secondary w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
