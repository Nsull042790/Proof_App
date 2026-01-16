'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { useToast } from '@/components/ui/Toast';
import { MOST_LIKELY_TO_PROMPTS, WOULD_YOU_RATHER_OPTIONS, IRL_GAME_PRESETS } from '@/lib/constants';
import { getPlayerDisplayName } from '@/lib/utils';
import { NightGame, NightGameScore } from '@/lib/types';

type TabType = 'play' | 'irl' | 'scores';

export default function GamesPage() {
  const { data, getCurrentPlayer, getPlayerById } = useData();
  const currentPlayer = getCurrentPlayer();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('play');

  // In-app game state
  const [activeGame, setActiveGame] = useState<'none' | 'mostlikely' | 'wyr'>('none');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [wyrChoice, setWyrChoice] = useState<'A' | 'B' | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [wyrVotes, setWyrVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [showResults, setShowResults] = useState(false);

  // IRL game state
  const [irlGames, setIrlGames] = useState<NightGame[]>([]);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameEmoji, setNewGameEmoji] = useState('🎮');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [editingGame, setEditingGame] = useState<NightGame | null>(null);
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({});

  // Get random prompt
  const currentPrompt = MOST_LIKELY_TO_PROMPTS[currentPromptIndex % MOST_LIKELY_TO_PROMPTS.length];
  const currentWyr = WOULD_YOU_RATHER_OPTIONS[currentPromptIndex % WOULD_YOU_RATHER_OPTIONS.length];

  // Calculate Most Likely To results
  const mltResults = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(votes).forEach((playerId) => {
      counts[playerId] = (counts[playerId] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([playerId, count]) => ({ playerId, count }));
  }, [votes]);

  // Calculate WYR results
  const wyrResults = useMemo(() => {
    let aCount = 0;
    let bCount = 0;
    Object.values(wyrVotes).forEach((choice) => {
      if (choice === 'A') aCount++;
      else bCount++;
    });
    return { a: aCount, b: bCount };
  }, [wyrVotes]);

  // Night games leaderboard
  const nightLeaderboard = useMemo(() => {
    const points: Record<string, number> = {};
    irlGames.forEach((game) => {
      game.scores.forEach((score) => {
        points[score.playerId] = (points[score.playerId] || 0) + score.score;
      });
    });
    return Object.entries(points)
      .sort(([, a], [, b]) => b - a)
      .map(([playerId, totalPoints]) => ({ playerId, totalPoints }));
  }, [irlGames]);

  const handleMltVote = () => {
    if (!currentPlayer || !selectedPlayer) return;
    setVotes((prev) => ({ ...prev, [currentPlayer.id]: selectedPlayer }));
    showToast('Vote cast!', 'success');
    setSelectedPlayer(null);
  };

  const handleWyrVote = () => {
    if (!currentPlayer || !wyrChoice) return;
    setWyrVotes((prev) => ({ ...prev, [currentPlayer.id]: wyrChoice }));
    showToast('Vote cast!', 'success');
    setWyrChoice(null);
  };

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => prev + 1);
    setVotes({});
    setWyrVotes({});
    setShowResults(false);
    setSelectedPlayer(null);
    setWyrChoice(null);
  };

  const handleAddIrlGame = () => {
    if (!newGameName.trim()) return;

    const newGame: NightGame = {
      id: `game-${Date.now()}`,
      name: newGameName.trim(),
      type: 'irl',
      scores: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    setIrlGames((prev) => [newGame, ...prev]);
    setNewGameName('');
    setNewGameEmoji('🎮');
    setSelectedPreset(null);
    setIsAddingGame(false);
    showToast('Game started!', 'success');
  };

  const handleUpdateScores = (gameId: string) => {
    setIrlGames((prev) =>
      prev.map((game) => {
        if (game.id !== gameId) return game;

        const newScores: NightGameScore[] = Object.entries(playerScores)
          .filter(([, score]) => score > 0)
          .map(([playerId, score]) => ({ playerId, score }));

        return { ...game, scores: newScores };
      })
    );
    setEditingGame(null);
    setPlayerScores({});
    showToast('Scores updated!', 'success');
  };

  const handleSelectPreset = (preset: typeof IRL_GAME_PRESETS[0]) => {
    setNewGameName(preset.name);
    setNewGameEmoji(preset.emoji);
    setSelectedPreset(preset.name);
  };

  const startEditingGame = (game: NightGame) => {
    setEditingGame(game);
    const scores: Record<string, number> = {};
    game.scores.forEach((s) => {
      scores[s.playerId] = s.score;
    });
    setPlayerScores(scores);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-4xl">🌙</span>
        <h1 className="text-2xl font-bold text-white mt-2">Night Games</h1>
        <p className="text-[#888888] text-sm">Off-course competition</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'play', label: '🎲 Play', name: 'play' as TabType },
          { id: 'irl', label: '🃏 IRL Games', name: 'irl' as TabType },
          { id: 'scores', label: '🏆 Scores', name: 'scores' as TabType },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.name
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Play Tab - In-App Games */}
      {activeTab === 'play' && (
        <div>
          {activeGame === 'none' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveGame('mostlikely')}
                className="card w-full text-left hover:border-[#FFD700] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <div className="text-white font-semibold">Most Likely To</div>
                    <div className="text-[#888888] text-sm">Vote on who fits the prompt</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveGame('wyr')}
                className="card w-full text-left hover:border-[#FFD700] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🤔</span>
                  <div>
                    <div className="text-white font-semibold">Would You Rather</div>
                    <div className="text-[#888888] text-sm">Pick your poison</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Most Likely To Game */}
          {activeGame === 'mostlikely' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveGame('none')}
                className="text-[#888888] text-sm hover:text-white"
              >
                ← Back to games
              </button>

              <div className="card">
                <div className="text-center mb-6">
                  <div className="text-[#888888] text-xs mb-2">MOST LIKELY TO...</div>
                  <div className="text-xl text-white font-bold">{currentPrompt}</div>
                </div>

                {!showResults ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {data.players.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => setSelectedPlayer(player.id)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedPlayer === player.id
                              ? 'bg-[#FFD700] text-black'
                              : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                          }`}
                        >
                          <div className="font-medium text-sm">
                            {player.nickname || player.name.split(' ')[0]}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleMltVote}
                        disabled={!selectedPlayer || !currentPlayer}
                        className="btn-primary flex-1"
                      >
                        Vote
                      </button>
                      <button
                        onClick={() => setShowResults(true)}
                        className="btn-secondary flex-1"
                      >
                        Show Results ({Object.keys(votes).length})
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {mltResults.length > 0 ? (
                        mltResults.map((result, idx) => {
                          const player = getPlayerById(result.playerId);
                          return (
                            <div
                              key={result.playerId}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                idx === 0 ? 'bg-[#FFD700]/20 border border-[#FFD700]' : 'bg-[#2a2a2a]'
                              }`}
                            >
                              <span className={idx === 0 ? 'text-[#FFD700] font-bold' : 'text-white'}>
                                {idx === 0 && '👑 '}
                                {player ? getPlayerDisplayName(player) : 'Unknown'}
                              </span>
                              <span className="text-[#888888]">{result.count} votes</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[#888888] text-center py-4">No votes yet</p>
                      )}
                    </div>

                    <button onClick={nextPrompt} className="btn-primary w-full">
                      Next Prompt
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Would You Rather Game */}
          {activeGame === 'wyr' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveGame('none')}
                className="text-[#888888] text-sm hover:text-white"
              >
                ← Back to games
              </button>

              <div className="card">
                <div className="text-center mb-4">
                  <div className="text-[#888888] text-xs mb-2">WOULD YOU RATHER...</div>
                </div>

                {!showResults ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <button
                        onClick={() => setWyrChoice('A')}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          wyrChoice === 'A'
                            ? 'bg-[#FFD700] text-black'
                            : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                        }`}
                      >
                        <span className="font-bold">A:</span> {currentWyr.a}
                      </button>
                      <div className="text-center text-[#666666] text-sm">OR</div>
                      <button
                        onClick={() => setWyrChoice('B')}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          wyrChoice === 'B'
                            ? 'bg-[#FFD700] text-black'
                            : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                        }`}
                      >
                        <span className="font-bold">B:</span> {currentWyr.b}
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleWyrVote}
                        disabled={!wyrChoice || !currentPlayer}
                        className="btn-primary flex-1"
                      >
                        Vote
                      </button>
                      <button
                        onClick={() => setShowResults(true)}
                        className="btn-secondary flex-1"
                      >
                        Show Results ({Object.keys(wyrVotes).length})
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className={`p-4 rounded-lg ${wyrResults.a >= wyrResults.b ? 'bg-[#FFD700]/20 border border-[#FFD700]' : 'bg-[#2a2a2a]'}`}>
                        <div className="flex justify-between items-center">
                          <span className={wyrResults.a >= wyrResults.b ? 'text-[#FFD700]' : 'text-white'}>
                            A: {currentWyr.a}
                          </span>
                          <span className="text-[#888888] font-bold">{wyrResults.a}</span>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${wyrResults.b > wyrResults.a ? 'bg-[#FFD700]/20 border border-[#FFD700]' : 'bg-[#2a2a2a]'}`}>
                        <div className="flex justify-between items-center">
                          <span className={wyrResults.b > wyrResults.a ? 'text-[#FFD700]' : 'text-white'}>
                            B: {currentWyr.b}
                          </span>
                          <span className="text-[#888888] font-bold">{wyrResults.b}</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={nextPrompt} className="btn-primary w-full">
                      Next Question
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* IRL Tab - Real World Games */}
      {activeTab === 'irl' && (
        <div>
          <button
            onClick={() => setIsAddingGame(true)}
            className="btn-primary w-full mb-4"
          >
            + Start New Game
          </button>

          {irlGames.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl">🎲</span>
              <p className="text-[#888888] mt-4">No games yet tonight</p>
              <p className="text-[#666666] text-sm">Start a game of LRC, poker, or anything!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {irlGames.map((game) => (
                <div key={game.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{newGameEmoji}</span>
                      <span className="text-white font-semibold">{game.name}</span>
                    </div>
                    <button
                      onClick={() => startEditingGame(game)}
                      className="text-[#FFD700] text-sm"
                    >
                      Edit Scores
                    </button>
                  </div>

                  {game.scores.length > 0 ? (
                    <div className="space-y-1">
                      {game.scores
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 3)
                        .map((score, idx) => {
                          const player = getPlayerById(score.playerId);
                          return (
                            <div key={score.playerId} className="flex justify-between text-sm">
                              <span className={idx === 0 ? 'text-[#FFD700]' : 'text-[#888888]'}>
                                {idx === 0 && '👑 '}
                                {player ? getPlayerDisplayName(player) : 'Unknown'}
                              </span>
                              <span className="text-white">{score.score}</span>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-[#666666] text-sm">No scores yet</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Game Modal */}
          {isAddingGame && (
            <>
              <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsAddingGame(false)} />
              <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
                <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up">
                  <h2 className="text-xl font-bold text-white mb-4">Start Game</h2>

                  <div className="mb-4">
                    <label className="block text-sm text-[#888888] mb-2">Quick Pick</label>
                    <div className="grid grid-cols-3 gap-2">
                      {IRL_GAME_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedPreset === preset.name
                              ? 'bg-[#FFD700] text-black'
                              : 'bg-[#2a2a2a] text-white'
                          }`}
                        >
                          <div className="text-xl">{preset.emoji}</div>
                          <div className="text-xs mt-1">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-[#888888] mb-2">Game Name</label>
                    <input
                      type="text"
                      value={newGameName}
                      onChange={(e) => setNewGameName(e.target.value)}
                      className="input"
                      placeholder="Enter game name..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setIsAddingGame(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button
                      onClick={handleAddIrlGame}
                      disabled={!newGameName.trim()}
                      className="btn-primary flex-1"
                    >
                      Start Game
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Edit Scores Modal */}
          {editingGame && (
            <>
              <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setEditingGame(null)} />
              <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
                <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-white mb-4">{editingGame.name} Scores</h2>

                  <div className="space-y-3 mb-4">
                    {data.players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3">
                        <span className="text-white flex-1">
                          {player.nickname || player.name}
                        </span>
                        <input
                          type="number"
                          value={playerScores[player.id] || ''}
                          onChange={(e) =>
                            setPlayerScores((prev) => ({
                              ...prev,
                              [player.id]: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="input w-24 text-center"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setEditingGame(null)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateScores(editingGame.id)}
                      className="btn-primary flex-1"
                    >
                      Save Scores
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Scores Tab - Leaderboard */}
      {activeTab === 'scores' && (
        <div>
          <div className="card mb-4">
            <h2 className="text-white font-semibold mb-4">🌙 Night Games Leaderboard</h2>

            {nightLeaderboard.length > 0 ? (
              <div className="space-y-2">
                {nightLeaderboard.map((entry, idx) => {
                  const player = getPlayerById(entry.playerId);
                  return (
                    <div
                      key={entry.playerId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        idx === 0 ? 'bg-[#FFD700]/20 border border-[#FFD700]' : 'bg-[#2a2a2a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center ${idx === 0 ? 'text-[#FFD700]' : 'text-[#888888]'}`}>
                          {idx === 0 ? '👑' : idx + 1}
                        </span>
                        <span className={idx === 0 ? 'text-[#FFD700] font-bold' : 'text-white'}>
                          {player ? getPlayerDisplayName(player) : 'Unknown'}
                        </span>
                      </div>
                      <span className="text-white font-bold">{entry.totalPoints}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#888888] text-center py-8">
                Play some games to see the leaderboard!
              </p>
            )}
          </div>

          <div className="text-center text-[#666666] text-sm">
            <p>Points from all IRL games combined</p>
          </div>
        </div>
      )}
    </div>
  );
}
