'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Player, Score, Photo, Challenge, Bet, Message, Quote, Prediction, TimeCapsuleEntry, Foursomes, ItineraryNotes, TripInfo } from '@/lib/types';
import * as dataHelpers from '@/lib/data';

interface DataContextType {
  data: AppData;
  isLoading: boolean;

  // Player methods
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setCurrentPlayer: (playerId: string) => void;
  getCurrentPlayer: () => Player | null;
  getPlayerById: (playerId: string) => Player | undefined;

  // Score methods
  addScore: (score: Omit<Score, 'id' | 'createdAt'>) => void;
  getPlayerScores: (playerId: string) => Score[];
  getRoundScores: (roundNumber: number) => Score[];

  // Photo methods
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt' | 'reactions'>) => void;
  reactToPhoto: (photoId: string, reaction: keyof Photo['reactions']) => void;

  // Challenge methods
  claimChallenge: (challengeId: string, playerId: string) => void;
  verifyChallenge: (challengeId: string, verifierId: string) => void;
  disputeChallenge: (challengeId: string, disputerId: string) => void;

  // Bet methods
  addBet: (bet: Omit<Bet, 'id' | 'createdAt' | 'status' | 'winner'>) => void;
  settleBet: (betId: string, winnerId: string) => void;

  // Message methods
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'reactions'>) => void;
  reactToMessage: (messageId: string, reaction: keyof Message['reactions']) => void;

  // Quote methods
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'reactions'>) => void;
  reactToQuote: (quoteId: string, reaction: keyof Quote['reactions']) => void;

  // Prediction methods
  addPrediction: (prediction: Omit<Prediction, 'id' | 'createdAt'>) => void;

  // Time Capsule methods
  addTimeCapsuleEntry: (entry: Omit<TimeCapsuleEntry, 'createdAt'>) => void;

  // Foursomes methods
  updateFoursomes: (foursomes: Foursomes) => void;

  // Itinerary methods
  updateItineraryNotes: (notes: ItineraryNotes) => void;

  // Trip info methods
  updateTripInfo: (tripInfo: TripInfo) => void;

  // Leaderboard
  getLeaderboard: () => ReturnType<typeof dataHelpers.getLeaderboard>;

  // Reset
  resetData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedData = dataHelpers.loadData();
    setData(loadedData);
    setIsLoading(false);
  }, []);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.updatePlayer(prev, playerId, updates);
    });
  }, []);

  const setCurrentPlayer = useCallback((playerId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.setCurrentPlayer(prev, playerId);
    });
  }, []);

  const getCurrentPlayer = useCallback(() => {
    if (!data || !data.currentPlayerId) return null;
    return data.players.find((p) => p.id === data.currentPlayerId) || null;
  }, [data]);

  const getPlayerById = useCallback((playerId: string) => {
    if (!data) return undefined;
    return data.players.find((p) => p.id === playerId);
  }, [data]);

  const addScore = useCallback((score: Omit<Score, 'id' | 'createdAt'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addScore(prev, score);
    });
  }, []);

  const getPlayerScores = useCallback((playerId: string) => {
    if (!data) return [];
    return data.scores.filter((s) => s.playerId === playerId);
  }, [data]);

  const getRoundScores = useCallback((roundNumber: number) => {
    if (!data) return [];
    return data.scores.filter((s) => s.roundNumber === roundNumber);
  }, [data]);

  const addPhoto = useCallback((photo: Omit<Photo, 'id' | 'createdAt' | 'reactions'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addPhoto(prev, photo);
    });
  }, []);

  const reactToPhoto = useCallback((photoId: string, reaction: keyof Photo['reactions']) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.reactToPhoto(prev, photoId, reaction);
    });
  }, []);

  const claimChallenge = useCallback((challengeId: string, playerId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.claimChallenge(prev, challengeId, playerId);
    });
  }, []);

  const verifyChallenge = useCallback((challengeId: string, verifierId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.verifyChallenge(prev, challengeId, verifierId);
    });
  }, []);

  const disputeChallenge = useCallback((challengeId: string, disputerId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.disputeChallenge(prev, challengeId, disputerId);
    });
  }, []);

  const addBet = useCallback((bet: Omit<Bet, 'id' | 'createdAt' | 'status' | 'winner'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addBet(prev, bet);
    });
  }, []);

  const settleBet = useCallback((betId: string, winnerId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.settleBet(prev, betId, winnerId);
    });
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt' | 'reactions'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addMessage(prev, message);
    });
  }, []);

  const reactToMessage = useCallback((messageId: string, reaction: keyof Message['reactions']) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.reactToMessage(prev, messageId, reaction);
    });
  }, []);

  const addQuote = useCallback((quote: Omit<Quote, 'id' | 'createdAt' | 'reactions'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addQuote(prev, quote);
    });
  }, []);

  const reactToQuote = useCallback((quoteId: string, reaction: keyof Quote['reactions']) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.reactToQuote(prev, quoteId, reaction);
    });
  }, []);

  const addPrediction = useCallback((prediction: Omit<Prediction, 'id' | 'createdAt'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addPrediction(prev, prediction);
    });
  }, []);

  const addTimeCapsuleEntry = useCallback((entry: Omit<TimeCapsuleEntry, 'createdAt'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.addTimeCapsuleEntry(prev, entry);
    });
  }, []);

  const updateFoursomes = useCallback((foursomes: Foursomes) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.updateFoursomes(prev, foursomes);
    });
  }, []);

  const updateItineraryNotes = useCallback((notes: ItineraryNotes) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.updateItineraryNotes(prev, notes);
    });
  }, []);

  const updateTripInfo = useCallback((tripInfo: TripInfo) => {
    setData((prev) => {
      if (!prev) return prev;
      return dataHelpers.updateTripInfo(prev, tripInfo);
    });
  }, []);

  const getLeaderboard = useCallback(() => {
    if (!data) return [];
    return dataHelpers.getLeaderboard(data);
  }, [data]);

  const resetData = useCallback(() => {
    const newData = dataHelpers.resetData();
    setData(newData);
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#FFD700] mb-2">PROOF</div>
          <div className="text-[#888888]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        updatePlayer,
        setCurrentPlayer,
        getCurrentPlayer,
        getPlayerById,
        addScore,
        getPlayerScores,
        getRoundScores,
        addPhoto,
        reactToPhoto,
        claimChallenge,
        verifyChallenge,
        disputeChallenge,
        addBet,
        settleBet,
        addMessage,
        reactToMessage,
        addQuote,
        reactToQuote,
        addPrediction,
        addTimeCapsuleEntry,
        updateFoursomes,
        updateItineraryNotes,
        updateTripInfo,
        getLeaderboard,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
