'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/components/providers/DataProvider';
import { EMPTY_STATES } from '@/lib/constants';
import { getPlayerDisplayName, formatTimestamp } from '@/lib/utils';

export default function BetsPage() {
  const searchParams = useSearchParams();
  const showCreate = searchParams.get('action') === 'create';

  const { data, getCurrentPlayer, addBet, settleBet, getPlayerById } = useData();
  const currentPlayer = getCurrentPlayer();

  const [isCreating, setIsCreating] = useState(showCreate);
  const [description, setDescription] = useState('');
  const [stakes, setStakes] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [settlingBetId, setSettlingBetId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'open' | 'settled'>('open');

  const filteredBets = data.bets.filter((b) =>
    viewMode === 'open' ? b.status === 'open' : b.status === 'settled'
  );

  const handleCreate = () => {
    if (!description.trim() || !stakes.trim() || selectedPlayers.length < 2 || !currentPlayer) return;

    addBet({
      description: description.trim(),
      stakes: stakes.trim(),
      playersInvolved: selectedPlayers,
      createdBy: currentPlayer.id,
    });

    setDescription('');
    setStakes('');
    setSelectedPlayers([]);
    setIsCreating(false);
  };

  const handleSettle = (winnerId: string) => {
    if (!settlingBetId) return;
    settleBet(settlingBetId, winnerId);
    setSettlingBetId(null);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Side Bets</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary text-sm py-2 px-4"
        >
          + New Bet
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('open')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
            viewMode === 'open'
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#1a1a1a] text-[#888888]'
          }`}
        >
          Open ({data.bets.filter((b) => b.status === 'open').length})
        </button>
        <button
          onClick={() => setViewMode('settled')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
            viewMode === 'settled'
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#1a1a1a] text-[#888888]'
          }`}
        >
          Settled ({data.bets.filter((b) => b.status === 'settled').length})
        </button>
      </div>

      {/* Bets List */}
      {filteredBets.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎰</div>
          <p className="text-[#888888] italic">{EMPTY_STATES.bets}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => {
            const creator = getPlayerById(bet.createdBy);
            const winner = bet.winner ? getPlayerById(bet.winner) : null;

            return (
              <div
                key={bet.id}
                className={`card ${bet.status === 'settled' ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-white font-semibold mb-1">{bet.description}</div>
                    <div className="text-[#FFD700] text-sm">Stakes: {bet.stakes}</div>
                  </div>
                  {bet.status === 'settled' && winner && (
                    <div className="text-right">
                      <div className="text-xs text-[#888888]">Winner</div>
                      <div className="text-[#22c55e] font-semibold">
                        {getPlayerDisplayName(winner)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {bet.playersInvolved.map((playerId) => {
                    const player = getPlayerById(playerId);
                    const isWinner = bet.winner === playerId;

                    return (
                      <span
                        key={playerId}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isWinner
                            ? 'bg-[#22c55e] text-white'
                            : 'bg-[#2a2a2a] text-[#888888]'
                        }`}
                      >
                        {player ? getPlayerDisplayName(player) : 'Unknown'}
                        {isWinner && ' 🏆'}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span>
                    Created by {creator ? getPlayerDisplayName(creator) : 'Unknown'}
                  </span>
                  <span>{formatTimestamp(bet.createdAt)}</span>
                </div>

                {bet.status === 'open' && (
                  <button
                    onClick={() => setSettlingBetId(bet.id)}
                    className="btn-secondary w-full mt-4 text-sm"
                  >
                    Settle Bet
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Bet Modal */}
      {isCreating && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setIsCreating(false)}
          />
          <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
            <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up">
              <h2 className="text-xl font-bold text-white mb-4">Create Side Bet</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2">The Bet</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                    placeholder="e.g., First ball in water"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2">Stakes</label>
                  <input
                    type="text"
                    value={stakes}
                    onChange={(e) => setStakes(e.target.value)}
                    className="input"
                    placeholder="e.g., Round of drinks"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2">
                    Players Involved (select 2+)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {data.players.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => {
                          setSelectedPlayers((prev) =>
                            prev.includes(player.id)
                              ? prev.filter((id) => id !== player.id)
                              : [...prev, player.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedPlayers.includes(player.id)
                            ? 'bg-[#FFD700] text-black'
                            : 'bg-[#2a2a2a] text-white'
                        }`}
                      >
                        {getPlayerDisplayName(player)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsCreating(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!description.trim() || !stakes.trim() || selectedPlayers.length < 2}
                    className="btn-primary flex-1"
                  >
                    Create Bet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settle Bet Modal */}
      {settlingBetId && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setSettlingBetId(null)}
          />
          <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
            <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up">
              <h2 className="text-xl font-bold text-white mb-4">Who Won?</h2>

              <div className="space-y-2">
                {data.bets
                  .find((b) => b.id === settlingBetId)
                  ?.playersInvolved.map((playerId) => {
                    const player = getPlayerById(playerId);

                    return (
                      <button
                        key={playerId}
                        onClick={() => handleSettle(playerId)}
                        className="w-full p-4 bg-[#2a2a2a] rounded-lg text-white font-medium hover:bg-[#3a3a3a] transition-colors"
                      >
                        {player ? getPlayerDisplayName(player) : 'Unknown'}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => setSettlingBetId(null)}
                className="btn-secondary w-full mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
