'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { getPlayerDisplayName } from '@/lib/utils';

export default function CapsulePage() {
  const { data, currentPlayerId, addTimeCapsuleEntry, getPlayerById } = useData();
  const currentPlayer = currentPlayerId ? data.players.find(p => p.id === currentPlayerId) || null : null;

  // Helper to safely get player name
  const getPlayerName = (playerId: string) => {
    const player = getPlayerById(playerId);
    return player ? getPlayerDisplayName(player) : 'Unknown';
  };

  const [isSealed, setIsSealed] = useState(true); // Toggle for reveal mode
  const [isEditing, setIsEditing] = useState(false);
  const [tripWinner, setTripWinner] = useState('');
  const [tripLast, setTripLast] = useState('');
  const [secretGoal, setSecretGoal] = useState('');
  const [prediction, setPrediction] = useState('');
  const [messageToSelf, setMessageToSelf] = useState('');

  const existingEntry = data.timeCapsule.find((e) => e.playerId === currentPlayer?.id);
  const hasEntry = !!existingEntry;

  const handleSave = () => {
    if (!currentPlayer || !tripWinner || !tripLast) return;

    addTimeCapsuleEntry({
      playerId: currentPlayer.id,
      tripWinner,
      tripLast,
      secretGoal,
      prediction,
      messageToSelf,
    });

    setIsEditing(false);
  };

  const startEditing = () => {
    if (existingEntry) {
      setTripWinner(existingEntry.tripWinner);
      setTripLast(existingEntry.tripLast);
      setSecretGoal(existingEntry.secretGoal);
      setPrediction(existingEntry.prediction);
      setMessageToSelf(existingEntry.messageToSelf);
    }
    setIsEditing(true);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-5xl">⏱️</span>
        <h1 className="text-2xl font-bold text-white mt-2">Time Capsule</h1>
        <p className="text-[#888888] text-sm">Sealed until the trip ends</p>
      </div>

      {/* Seal/Reveal Toggle (for demo) */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Capsule Status</div>
            <div className="text-[#888888] text-sm">
              {isSealed ? 'Locked until Monday' : 'Revealed!'}
            </div>
          </div>
          <button
            onClick={() => setIsSealed(!isSealed)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              isSealed
                ? 'bg-[#2a2a2a] text-[#888888]'
                : 'bg-[#FFD700] text-black'
            }`}
          >
            {isSealed ? '🔒 Sealed' : '🔓 Revealed'}
          </button>
        </div>
      </div>

      {/* Your Entry */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Your Entry</h2>
          {currentPlayer && !isEditing && (
            <button
              onClick={startEditing}
              className="text-[#FFD700] text-sm hover:underline"
            >
              {hasEntry ? 'Edit' : '+ Add Entry'}
            </button>
          )}
        </div>

        {!currentPlayer ? (
          <p className="text-[#888888] text-sm">Select a player in Setup to add an entry</p>
        ) : hasEntry && !isEditing ? (
          <div className="text-center py-8">
            <span className="text-4xl">📦</span>
            <p className="text-[#888888] mt-2">Your entry is sealed</p>
            <p className="text-[#666666] text-sm">
              Check back on Monday to see what you predicted
            </p>
          </div>
        ) : !isEditing ? (
          <div className="text-center py-8">
            <span className="text-4xl">✍️</span>
            <p className="text-[#888888] mt-2">You haven't added an entry yet</p>
            <button
              onClick={startEditing}
              className="btn-primary mt-4"
            >
              Add Your Predictions
            </button>
          </div>
        ) : null}
      </div>

      {/* Entry Form */}
      {isEditing && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Seal Your Predictions</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2">Who wins the trip?</label>
              <select
                value={tripWinner}
                onChange={(e) => setTripWinner(e.target.value)}
                className="input"
              >
                <option value="">Select player...</option>
                {data.players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {getPlayerDisplayName(player)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2">Who finishes last?</label>
              <select
                value={tripLast}
                onChange={(e) => setTripLast(e.target.value)}
                className="input"
              >
                <option value="">Select player...</option>
                {data.players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {getPlayerDisplayName(player)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2">Your secret goal for this trip</label>
              <input
                type="text"
                value={secretGoal}
                onChange={(e) => setSecretGoal(e.target.value)}
                className="input"
                placeholder="e.g., Break 90"
              />
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2">Something you think will happen</label>
              <input
                type="text"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                className="input"
                placeholder="e.g., Someone falls in the lake"
              />
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2">Message to future you</label>
              <textarea
                value={messageToSelf}
                onChange={(e) => setMessageToSelf(e.target.value)}
                className="input min-h-[80px] resize-none"
                placeholder="What do you want to remember?"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!tripWinner || !tripLast}
                className="btn-primary flex-1"
              >
                Seal It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revealed Entries */}
      {!isSealed && (
        <div>
          <h2 className="text-white font-semibold mb-4">All Entries Revealed!</h2>
          <div className="space-y-4">
            {data.timeCapsule.map((entry) => {
              const player = getPlayerById(entry.playerId);

              return (
                <div key={entry.playerId} className="card">
                  <div className="text-[#FFD700] font-semibold mb-3">
                    {player ? getPlayerDisplayName(player) : 'Unknown'}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[#888888]">Predicted Winner: </span>
                      <span className="text-white">
                        {getPlayerName(entry.tripWinner)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#888888]">Predicted Last: </span>
                      <span className="text-white">
                        {getPlayerName(entry.tripLast)}
                      </span>
                    </div>
                    {entry.secretGoal && (
                      <div>
                        <span className="text-[#888888]">Secret Goal: </span>
                        <span className="text-white italic">"{entry.secretGoal}"</span>
                      </div>
                    )}
                    {entry.prediction && (
                      <div>
                        <span className="text-[#888888]">Prediction: </span>
                        <span className="text-white italic">"{entry.prediction}"</span>
                      </div>
                    )}
                    {entry.messageToSelf && (
                      <div>
                        <span className="text-[#888888]">Message to Self: </span>
                        <span className="text-white italic">"{entry.messageToSelf}"</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {data.timeCapsule.length === 0 && (
              <div className="text-center py-8">
                <span className="text-4xl">📭</span>
                <p className="text-[#888888] mt-2">No entries yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Participants Count */}
      <div className="text-center mt-6 text-[#666666] text-sm">
        {data.timeCapsule.length}/12 players have added entries
      </div>
    </div>
  );
}
