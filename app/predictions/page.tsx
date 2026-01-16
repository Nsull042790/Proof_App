'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { ROUNDS, EMPTY_STATES } from '@/lib/constants';
import { getPlayerDisplayName } from '@/lib/utils';

export default function PredictionsPage() {
  const { data, currentPlayerId, addPrediction, getPlayerById } = useData();
  const currentPlayer = currentPlayerId ? data.players.find(p => p.id === currentPlayerId) || null : null;

  const [selectedRound, setSelectedRound] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [predictedWinner, setPredictedWinner] = useState('');
  const [ownOverUnder, setOwnOverUnder] = useState(90);
  const [firstWater, setFirstWater] = useState('');
  const [most3Putts, setMost3Putts] = useState('');

  // Get existing prediction for current player and round
  const existingPrediction = data.predictions.find(
    (p) => p.playerId === currentPlayer?.id && p.roundNumber === selectedRound
  );

  // Get all predictions for selected round
  const roundPredictions = data.predictions.filter(
    (p) => p.roundNumber === selectedRound
  );

  const handleSave = () => {
    if (!currentPlayer || !predictedWinner || !firstWater || !most3Putts) return;

    addPrediction({
      playerId: currentPlayer.id,
      roundNumber: selectedRound,
      predictedWinner,
      ownOverUnder,
      firstWater,
      most3Putts,
    });

    setIsEditing(false);
  };

  const startEditing = () => {
    if (existingPrediction) {
      setPredictedWinner(existingPrediction.predictedWinner);
      setOwnOverUnder(existingPrediction.ownOverUnder);
      setFirstWater(existingPrediction.firstWater);
      setMost3Putts(existingPrediction.most3Putts);
    }
    setIsEditing(true);
  };

  const selectedRoundInfo = ROUNDS.find((r) => r.number === selectedRound);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Predictions</h1>

      {/* Round Selection */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {ROUNDS.map((round) => (
            <button
              key={round.number}
              onClick={() => setSelectedRound(round.number)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedRound === round.number
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1a1a1a] text-[#888888]'
              }`}
            >
              {round.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-center text-[#888888] text-sm">
          {selectedRoundInfo?.course} • {selectedRoundInfo?.day}
        </div>
      </div>

      {/* Your Prediction */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Your Prediction</h2>
          {currentPlayer && !isEditing && (
            <button
              onClick={startEditing}
              className="text-[#FFD700] text-sm hover:underline"
            >
              {existingPrediction ? 'Edit' : '+ Make Prediction'}
            </button>
          )}
        </div>

        {!currentPlayer ? (
          <p className="text-[#888888] text-sm">Select a player in Setup to make predictions</p>
        ) : existingPrediction && !isEditing ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#888888]">Round Winner</span>
              <span className="text-white">
                {getPlayerDisplayName(getPlayerById(existingPrediction.predictedWinner)!)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Your Over/Under</span>
              <span className="text-white">{existingPrediction.ownOverUnder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">First in Water</span>
              <span className="text-white">
                {getPlayerDisplayName(getPlayerById(existingPrediction.firstWater)!)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Most 3-Putts</span>
              <span className="text-white">
                {getPlayerDisplayName(getPlayerById(existingPrediction.most3Putts)!)}
              </span>
            </div>
          </div>
        ) : !isEditing ? (
          <p className="text-[#666666] text-sm italic">{EMPTY_STATES.predictions}</p>
        ) : null}
      </div>

      {/* Prediction Form */}
      {isEditing && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Make Your Picks</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#888888] mb-2">Who wins this round?</label>
              <select
                value={predictedWinner}
                onChange={(e) => setPredictedWinner(e.target.value)}
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
              <label className="block text-sm text-[#888888] mb-2">
                Your over/under: <span className="text-[#FFD700]">{ownOverUnder}</span>
              </label>
              <input
                type="range"
                min="70"
                max="120"
                value={ownOverUnder}
                onChange={(e) => setOwnOverUnder(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
              />
              <div className="flex justify-between text-xs text-[#666666] mt-1">
                <span>70</span>
                <span>120</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#888888] mb-2">First ball in water?</label>
              <select
                value={firstWater}
                onChange={(e) => setFirstWater(e.target.value)}
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
              <label className="block text-sm text-[#888888] mb-2">Most 3-putts?</label>
              <select
                value={most3Putts}
                onChange={(e) => setMost3Putts(e.target.value)}
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

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!predictedWinner || !firstWater || !most3Putts}
                className="btn-primary flex-1"
              >
                Lock It In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Predictions for Round */}
      {roundPredictions.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4">All Predictions for {selectedRoundInfo?.name}</h2>
          <div className="space-y-3">
            {roundPredictions.map((pred) => {
              const predictor = getPlayerById(pred.playerId);

              return (
                <div key={pred.id} className="card">
                  <div className="text-[#FFD700] font-semibold mb-2">
                    {predictor ? getPlayerDisplayName(predictor) : 'Unknown'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#888888]">Winner:</div>
                    <div className="text-white">
                      {getPlayerDisplayName(getPlayerById(pred.predictedWinner)!)}
                    </div>
                    <div className="text-[#888888]">O/U:</div>
                    <div className="text-white">{pred.ownOverUnder}</div>
                    <div className="text-[#888888]">First Water:</div>
                    <div className="text-white">
                      {getPlayerDisplayName(getPlayerById(pred.firstWater)!)}
                    </div>
                    <div className="text-[#888888]">Most 3-Putts:</div>
                    <div className="text-white">
                      {getPlayerDisplayName(getPlayerById(pred.most3Putts)!)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
