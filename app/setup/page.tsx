'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { useToast } from '@/components/ui/Toast';
import { Player } from '@/lib/types';
import { getHandicapLabel } from '@/lib/constants';
import { getPlayerDisplayName } from '@/lib/utils';

export default function SetupPage() {
  const { data, updatePlayer, setCurrentPlayer, getCurrentPlayer } = useData();
  const { showToast } = useToast();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const currentPlayer = getCurrentPlayer();

  const handleSavePlayer = (updates: Partial<Player>) => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, updates);
      setEditingPlayer(null);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Player Setup</h1>
        <p className="text-[#888888]">
          Tap a card to edit player info. Select yourself to personalize your experience.
        </p>
      </div>

      {/* Current Player Selection */}
      {currentPlayer ? (
        <div className="mb-6 p-4 bg-[#1a472a]/30 border border-[#1a472a] rounded-xl">
          <div className="text-[#888888] text-sm mb-1">You are playing as</div>
          <div className="text-[#FFD700] font-bold text-lg">
            {getPlayerDisplayName(currentPlayer)}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-[#8B0000]/20 border border-[#8B0000]/50 rounded-xl">
          <div className="text-[#ff6b6b] font-medium">No player selected</div>
          <div className="text-[#888888] text-sm mt-1">
            Tap your name below and click "This is me" to get started
          </div>
        </div>
      )}

      {/* Player Grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.players.map((player) => (
          <button
            key={player.id}
            onClick={() => setEditingPlayer(player)}
            className={`card text-left transition-all hover:border-[#FFD700]/50 ${
              currentPlayer?.id === player.id ? 'border-[#FFD700]' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl font-bold text-[#FFD700]">
                #{player.number}
              </span>
              {currentPlayer?.id === player.id && (
                <span className="text-xs bg-[#FFD700] text-black px-2 py-0.5 rounded-full font-medium">
                  YOU
                </span>
              )}
            </div>
            <div className="text-white font-semibold truncate">
              {player.name}
            </div>
            {player.nickname && (
              <div className="text-[#888888] text-sm truncate">
                "{player.nickname}"
              </div>
            )}
            <div className="mt-2 text-xs text-[#666666]">
              HCP: {player.handicap} • {getHandicapLabel(player.handicap)}
            </div>
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          isCurrentPlayer={currentPlayer?.id === editingPlayer.id}
          onSave={handleSavePlayer}
          onSelectAsMe={() => {
            setCurrentPlayer(editingPlayer.id);
            showToast(`You're now playing as ${editingPlayer.name}!`, 'success');
          }}
          onClose={() => setEditingPlayer(null)}
        />
      )}
    </div>
  );
}

interface EditPlayerModalProps {
  player: Player;
  isCurrentPlayer: boolean;
  onSave: (updates: Partial<Player>) => void;
  onSelectAsMe: () => void;
  onClose: () => void;
}

function EditPlayerModal({
  player,
  isCurrentPlayer,
  onSave,
  onSelectAsMe,
  onClose,
}: EditPlayerModalProps) {
  const [name, setName] = useState(player.name);
  const [nickname, setNickname] = useState(player.nickname);
  const [handicap, setHandicap] = useState(player.handicap);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, nickname, handicap });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 bottom-0 top-auto z-50 animate-slide-up max-w-lg mx-auto">
        <div className="bg-[#1a1a1a] rounded-t-2xl border border-[#2a2a2a] border-b-0 p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Edit Player #{player.number}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a]"
            >
              <svg
                className="w-6 h-6 text-[#888888]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm text-[#888888] mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter name"
              />
            </div>

            {/* Nickname Input */}
            <div>
              <label className="block text-sm text-[#888888] mb-2">
                Nickname (optional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input"
                placeholder="The legend is known as..."
              />
            </div>

            {/* Handicap Slider */}
            <div>
              <label className="block text-sm text-[#888888] mb-2">
                Handicap: <span className="text-[#FFD700] font-bold">{handicap}</span>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={handicap}
                onChange={(e) => setHandicap(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
              />
              <div className="text-center mt-2 text-sm text-[#666666] italic">
                "{getHandicapLabel(handicap)}"
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {!isCurrentPlayer && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectAsMe();
                    // Small delay to ensure state updates before closing
                    setTimeout(onClose, 100);
                  }}
                  className="btn-secondary flex-1"
                >
                  This is me
                </button>
              )}
              <button type="submit" className="btn-primary flex-1">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
