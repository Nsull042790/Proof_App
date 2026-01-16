'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { useToast } from '@/components/ui/Toast';
import { ROUNDS } from '@/lib/constants';
import { getPlayerDisplayName, calculateTotal, calculateFrontNine, calculateBackNine } from '@/lib/utils';

export default function ScoresPage() {
  const { data, getCurrentPlayer, addScore } = useData();
  const currentPlayer = getCurrentPlayer();
  const { showToast } = useToast();

  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedPlayerId, setSelectedPlayerId] = useState(currentPlayer?.id || data.players[0]?.id);
  const [holeScores, setHoleScores] = useState<number[]>(Array(18).fill(0));
  const [blooperNote, setBlooperNote] = useState('');
  const [quickMode, setQuickMode] = useState(false);
  const [frontNine, setFrontNine] = useState(0);
  const [backNine, setBackNine] = useState(0);
  const [editingHole, setEditingHole] = useState<number | null>(null);

  // Load existing score if any
  useMemo(() => {
    const existingScore = data.scores.find(
      (s) => s.playerId === selectedPlayerId && s.roundNumber === selectedRound
    );
    if (existingScore) {
      setHoleScores(existingScore.holeScores);
      setBlooperNote(existingScore.blooperNote);
      setFrontNine(calculateFrontNine(existingScore.holeScores));
      setBackNine(calculateBackNine(existingScore.holeScores));
    } else {
      setHoleScores(Array(18).fill(0));
      setBlooperNote('');
      setFrontNine(0);
      setBackNine(0);
    }
  }, [selectedPlayerId, selectedRound, data.scores]);

  const selectedPlayer = data.players.find((p) => p.id === selectedPlayerId);
  const selectedRoundInfo = ROUNDS.find((r) => r.number === selectedRound);

  const total = quickMode ? frontNine + backNine : calculateTotal(holeScores);

  const handleHoleScore = (hole: number, score: number) => {
    const newScores = [...holeScores];
    newScores[hole] = score;
    setHoleScores(newScores);
    setEditingHole(null);
  };

  const handleSubmit = () => {
    if (!selectedPlayerId) return;

    const finalScores = quickMode
      ? Array(18).fill(0).map((_, i) => i < 9 ? Math.round(frontNine / 9) : Math.round(backNine / 9))
      : holeScores;

    addScore({
      playerId: selectedPlayerId,
      roundNumber: selectedRound,
      holeScores: finalScores,
      total: quickMode ? frontNine + backNine : calculateTotal(holeScores),
      blooperNote,
    });

    showToast('Locked in. No take-backs.', 'success');
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Enter Scores</h1>

      {/* Round Selection */}
      <div className="mb-4">
        <label className="block text-sm text-[#888888] mb-2">Round</label>
        <div className="grid grid-cols-2 gap-2">
          {ROUNDS.map((round) => (
            <button
              key={round.number}
              onClick={() => setSelectedRound(round.number)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedRound === round.number
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="font-semibold">{round.course}</div>
              <div className={`text-xs ${selectedRound === round.number ? 'text-black/70' : 'text-[#888888]'}`}>
                {round.day}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player Selection */}
      <div className="mb-4">
        <label className="block text-sm text-[#888888] mb-2">Player</label>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className="input"
        >
          {data.players.map((player) => (
            <option key={player.id} value={player.id}>
              {getPlayerDisplayName(player)} {player.id === currentPlayer?.id ? '(You)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Mode Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setQuickMode(!quickMode)}
          className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
            quickMode ? 'bg-[#1a472a] border border-[#22c55e]' : 'bg-[#1a1a1a]'
          }`}
        >
          <span className="text-white font-medium">Quick Mode (Just Totals)</span>
          <span className={`w-12 h-6 rounded-full relative transition-all ${
            quickMode ? 'bg-[#22c55e]' : 'bg-[#2a2a2a]'
          }`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              quickMode ? 'left-7' : 'left-1'
            }`} />
          </span>
        </button>
      </div>

      {quickMode ? (
        /* Quick Entry */
        <div className="card mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2">Front 9</label>
              <input
                type="number"
                value={frontNine || ''}
                onChange={(e) => setFrontNine(parseInt(e.target.value) || 0)}
                className="input text-center text-2xl font-bold"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888888] mb-2">Back 9</label>
              <input
                type="number"
                value={backNine || ''}
                onChange={(e) => setBackNine(parseInt(e.target.value) || 0)}
                className="input text-center text-2xl font-bold"
                placeholder="0"
              />
            </div>
          </div>
          <div className="text-center py-4 border-t border-[#2a2a2a]">
            <div className="text-[#888888] text-sm">Total</div>
            <div className="text-4xl font-bold text-[#FFD700]">{total || '-'}</div>
          </div>
        </div>
      ) : (
        /* Hole-by-Hole Entry */
        <div className="card mb-4">
          <div className="grid grid-cols-9 gap-1 mb-2">
            {/* Front 9 */}
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i}
                onClick={() => setEditingHole(i)}
                className={`aspect-square rounded flex flex-col items-center justify-center text-xs transition-all ${
                  holeScores[i] > 0
                    ? 'bg-[#1a472a] text-white'
                    : 'bg-[#2a2a2a] text-[#666666]'
                } ${editingHole === i ? 'ring-2 ring-[#FFD700]' : ''}`}
              >
                <span className="text-[10px] text-[#888888]">{i + 1}</span>
                <span className="font-bold">{holeScores[i] || '-'}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm mb-4 px-2">
            <span className="text-[#888888]">Front 9</span>
            <span className="font-bold text-white">{calculateFrontNine(holeScores) || '-'}</span>
          </div>

          <div className="grid grid-cols-9 gap-1 mb-2">
            {/* Back 9 */}
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i + 9}
                onClick={() => setEditingHole(i + 9)}
                className={`aspect-square rounded flex flex-col items-center justify-center text-xs transition-all ${
                  holeScores[i + 9] > 0
                    ? 'bg-[#1a472a] text-white'
                    : 'bg-[#2a2a2a] text-[#666666]'
                } ${editingHole === i + 9 ? 'ring-2 ring-[#FFD700]' : ''}`}
              >
                <span className="text-[10px] text-[#888888]">{i + 10}</span>
                <span className="font-bold">{holeScores[i + 9] || '-'}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm mb-4 px-2">
            <span className="text-[#888888]">Back 9</span>
            <span className="font-bold text-white">{calculateBackNine(holeScores) || '-'}</span>
          </div>

          <div className="text-center py-4 border-t border-[#2a2a2a]">
            <div className="text-[#888888] text-sm">Total</div>
            <div className="text-4xl font-bold text-[#FFD700]">{total || '-'}</div>
          </div>
        </div>
      )}

      {/* Score Picker Modal */}
      {editingHole !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setEditingHole(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-2xl p-4 z-50 animate-slide-up">
            <div className="text-center mb-4">
              <span className="text-[#888888]">Hole {editingHole + 1}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((score) => (
                <button
                  key={score}
                  onClick={() => handleHoleScore(editingHole, score)}
                  className={`h-12 rounded-lg font-bold text-lg transition-all ${
                    holeScores[editingHole] === score
                      ? 'bg-[#FFD700] text-black'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Blooper Note */}
      <div className="mb-6">
        <label className="block text-sm text-[#888888] mb-2">
          Blooper Note (optional)
        </label>
        <textarea
          value={blooperNote}
          onChange={(e) => setBlooperNote(e.target.value)}
          className="input min-h-[80px] resize-none"
          placeholder="What happened out there?"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={total === 0}
        className={`btn-primary w-full ${total === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Submit Round
      </button>
    </div>
  );
}
