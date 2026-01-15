// localStorage data management for PROOF App

import { AppData, Player, Score, Photo, Challenge, Bet, Message, Quote, Prediction, TimeCapsuleEntry, Foursomes, ItineraryNotes, TripInfo } from './types';
import { generateId } from './utils';
import { createInitialChallenges } from './challenges';

const STORAGE_KEY = 'proof-app-data';

// Initial player data
const createInitialPlayers = (): Player[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `player-${i + 1}`,
    number: i + 1,
    name: `Player ${i + 1}`,
    nickname: '',
    handicap: 20,
    avatar: null,
    challengePoints: 0,
    predictionPoints: 0,
  }));
};

// Initial foursomes
const createInitialFoursomes = (): Foursomes => ({
  round1: [
    ['player-1', 'player-2', 'player-3', 'player-4'],
    ['player-5', 'player-6', 'player-7', 'player-8'],
    ['player-9', 'player-10', 'player-11', 'player-12'],
  ],
  round2: [
    ['player-1', 'player-5', 'player-9', 'player-2'],
    ['player-6', 'player-10', 'player-3', 'player-7'],
    ['player-11', 'player-4', 'player-8', 'player-12'],
  ],
  round3: [
    ['player-1', 'player-6', 'player-11', 'player-4'],
    ['player-2', 'player-7', 'player-12', 'player-5'],
    ['player-3', 'player-8', 'player-9', 'player-10'],
  ],
  round4: [
    ['player-1', 'player-7', 'player-10', 'player-5'],
    ['player-2', 'player-8', 'player-11', 'player-6'],
    ['player-3', 'player-9', 'player-12', 'player-4'],
  ],
});

// Initial itinerary notes
const createInitialItineraryNotes = (): ItineraryNotes => ({
  thursday: ['Arrive whenever', 'Claim your room', 'Fridge inventory', 'Welcome beers'],
  friday: ['AM: Ponce de Leon', 'PM: Balboa', 'Evening: Dinner TBD'],
  saturday: ['AM: Free time', 'PM: Isabella', 'Evening: Whatever happens'],
  sunday: ['AM: Granada (Championship)', 'PM: Free time', 'Evening: Awards ceremony'],
  monday: ['Check-out', 'Same time next year?'],
});

// Initial trip info
const createInitialTripInfo = (): TripInfo => ({
  houseAddress: '123 Golf Lane, Hot Springs Village, AR',
  doorCode: '1234',
  wifiPassword: 'golfboys2025',
  emergencyContact: 'Trip Organizer: 555-123-4567',
  nearestHospital: 'CHI St. Vincent Hot Springs',
  localPizza: "Domino's: 501-555-1234",
});

// Get default app data
const getDefaultData = (): AppData => ({
  players: createInitialPlayers(),
  currentPlayerId: null,
  scores: [],
  foursomes: createInitialFoursomes(),
  photos: [],
  challenges: createInitialChallenges(),
  bets: [],
  messages: [],
  quotes: [],
  predictions: [],
  timeCapsule: [],
  itineraryNotes: createInitialItineraryNotes(),
  tripInfo: createInitialTripInfo(),
});

// Load data from localStorage
export const loadData = (): AppData => {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppData;
      // Merge with defaults to handle new fields
      return {
        ...getDefaultData(),
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return getDefaultData();
};

// Save data to localStorage
export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
    // If localStorage is full, try to clear some photo data
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      const trimmedData = {
        ...data,
        photos: data.photos.slice(-5), // Keep only last 5 photos
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
    }
  }
};

// Reset all data
export const resetData = (): AppData => {
  const defaultData = getDefaultData();
  saveData(defaultData);
  return defaultData;
};

// Player helpers
export const updatePlayer = (data: AppData, playerId: string, updates: Partial<Player>): AppData => {
  const newData = {
    ...data,
    players: data.players.map((p) =>
      p.id === playerId ? { ...p, ...updates } : p
    ),
  };
  saveData(newData);
  return newData;
};

export const setCurrentPlayer = (data: AppData, playerId: string): AppData => {
  const newData = { ...data, currentPlayerId: playerId };
  saveData(newData);
  return newData;
};

// Score helpers
export const addScore = (data: AppData, score: Omit<Score, 'id' | 'createdAt'>): AppData => {
  // Check if score already exists for this player and round
  const existingIndex = data.scores.findIndex(
    (s) => s.playerId === score.playerId && s.roundNumber === score.roundNumber
  );

  const newScore: Score = {
    ...score,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  let newScores: Score[];
  if (existingIndex >= 0) {
    // Update existing score
    newScores = [...data.scores];
    newScores[existingIndex] = { ...newScores[existingIndex], ...score, createdAt: new Date().toISOString() };
  } else {
    // Add new score
    newScores = [...data.scores, newScore];
  }

  const newData = { ...data, scores: newScores };
  saveData(newData);
  return newData;
};

// Photo helpers
export const addPhoto = (data: AppData, photo: Omit<Photo, 'id' | 'createdAt' | 'reactions'>): AppData => {
  const newPhoto: Photo = {
    ...photo,
    id: generateId(),
    reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
    createdAt: new Date().toISOString(),
  };

  const newData = { ...data, photos: [newPhoto, ...data.photos] };
  saveData(newData);
  return newData;
};

export const reactToPhoto = (data: AppData, photoId: string, reaction: keyof Photo['reactions']): AppData => {
  const newData = {
    ...data,
    photos: data.photos.map((p) =>
      p.id === photoId
        ? { ...p, reactions: { ...p.reactions, [reaction]: p.reactions[reaction] + 1 } }
        : p
    ),
  };
  saveData(newData);
  return newData;
};

// Challenge helpers
export const claimChallenge = (data: AppData, challengeId: string, playerId: string): AppData => {
  const newData = {
    ...data,
    challenges: data.challenges.map((c) =>
      c.id === challengeId ? { ...c, status: 'claimed' as const, claimedBy: playerId } : c
    ),
  };
  saveData(newData);
  return newData;
};

export const verifyChallenge = (data: AppData, challengeId: string, verifierId: string): AppData => {
  const challenge = data.challenges.find((c) => c.id === challengeId);
  if (!challenge || !challenge.claimedBy) return data;

  const verifiedBy = [...challenge.verifiedBy, verifierId];
  const isVerified = verifiedBy.length >= 2; // Need 2 verifications

  let newPlayers = data.players;
  if (isVerified) {
    newPlayers = data.players.map((p) =>
      p.id === challenge.claimedBy
        ? { ...p, challengePoints: p.challengePoints + challenge.points }
        : p
    );
  }

  const newData = {
    ...data,
    players: newPlayers,
    challenges: data.challenges.map((c) =>
      c.id === challengeId
        ? { ...c, verifiedBy, status: isVerified ? 'verified' as const : c.status }
        : c
    ),
  };
  saveData(newData);
  return newData;
};

export const disputeChallenge = (data: AppData, challengeId: string, disputerId: string): AppData => {
  const challenge = data.challenges.find((c) => c.id === challengeId);
  if (!challenge) return data;

  const disputedBy = [...challenge.disputedBy, disputerId];
  const isDisputed = disputedBy.length >= 3; // Need 3 disputes to reset

  const newData = {
    ...data,
    challenges: data.challenges.map((c) =>
      c.id === challengeId
        ? isDisputed
          ? { ...c, status: 'open' as const, claimedBy: null, verifiedBy: [], disputedBy: [] }
          : { ...c, disputedBy }
        : c
    ),
  };
  saveData(newData);
  return newData;
};

// Bet helpers
export const addBet = (data: AppData, bet: Omit<Bet, 'id' | 'createdAt' | 'status' | 'winner'>): AppData => {
  const newBet: Bet = {
    ...bet,
    id: generateId(),
    status: 'open',
    winner: null,
    createdAt: new Date().toISOString(),
  };

  const newData = { ...data, bets: [newBet, ...data.bets] };
  saveData(newData);
  return newData;
};

export const settleBet = (data: AppData, betId: string, winnerId: string): AppData => {
  const newData = {
    ...data,
    bets: data.bets.map((b) =>
      b.id === betId ? { ...b, status: 'settled' as const, winner: winnerId } : b
    ),
  };
  saveData(newData);
  return newData;
};

// Message helpers
export const addMessage = (data: AppData, message: Omit<Message, 'id' | 'createdAt' | 'reactions'>): AppData => {
  const newMessage: Message = {
    ...message,
    id: generateId(),
    reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
    createdAt: new Date().toISOString(),
  };

  const newData = { ...data, messages: [...data.messages, newMessage] };
  saveData(newData);
  return newData;
};

export const reactToMessage = (data: AppData, messageId: string, reaction: keyof Message['reactions']): AppData => {
  const newData = {
    ...data,
    messages: data.messages.map((m) =>
      m.id === messageId
        ? { ...m, reactions: { ...m.reactions, [reaction]: m.reactions[reaction] + 1 } }
        : m
    ),
  };
  saveData(newData);
  return newData;
};

// Quote helpers
export const addQuote = (data: AppData, quote: Omit<Quote, 'id' | 'createdAt' | 'reactions'>): AppData => {
  const newQuote: Quote = {
    ...quote,
    id: generateId(),
    reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
    createdAt: new Date().toISOString(),
  };

  const newData = { ...data, quotes: [newQuote, ...data.quotes] };
  saveData(newData);
  return newData;
};

export const reactToQuote = (data: AppData, quoteId: string, reaction: keyof Quote['reactions']): AppData => {
  const newData = {
    ...data,
    quotes: data.quotes.map((q) =>
      q.id === quoteId
        ? { ...q, reactions: { ...q.reactions, [reaction]: q.reactions[reaction] + 1 } }
        : q
    ),
  };
  saveData(newData);
  return newData;
};

// Prediction helpers
export const addPrediction = (data: AppData, prediction: Omit<Prediction, 'id' | 'createdAt'>): AppData => {
  // Check if prediction already exists for this player and round
  const existingIndex = data.predictions.findIndex(
    (p) => p.playerId === prediction.playerId && p.roundNumber === prediction.roundNumber
  );

  const newPrediction: Prediction = {
    ...prediction,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  let newPredictions: Prediction[];
  if (existingIndex >= 0) {
    newPredictions = [...data.predictions];
    newPredictions[existingIndex] = newPrediction;
  } else {
    newPredictions = [...data.predictions, newPrediction];
  }

  const newData = { ...data, predictions: newPredictions };
  saveData(newData);
  return newData;
};

// Time Capsule helpers
export const addTimeCapsuleEntry = (data: AppData, entry: Omit<TimeCapsuleEntry, 'createdAt'>): AppData => {
  const existingIndex = data.timeCapsule.findIndex((e) => e.playerId === entry.playerId);

  const newEntry: TimeCapsuleEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  };

  let newTimeCapsule: TimeCapsuleEntry[];
  if (existingIndex >= 0) {
    newTimeCapsule = [...data.timeCapsule];
    newTimeCapsule[existingIndex] = newEntry;
  } else {
    newTimeCapsule = [...data.timeCapsule, newEntry];
  }

  const newData = { ...data, timeCapsule: newTimeCapsule };
  saveData(newData);
  return newData;
};

// Foursomes helpers
export const updateFoursomes = (data: AppData, foursomes: Foursomes): AppData => {
  const newData = { ...data, foursomes };
  saveData(newData);
  return newData;
};

// Itinerary helpers
export const updateItineraryNotes = (data: AppData, notes: ItineraryNotes): AppData => {
  const newData = { ...data, itineraryNotes: notes };
  saveData(newData);
  return newData;
};

// Trip info helpers
export const updateTripInfo = (data: AppData, tripInfo: TripInfo): AppData => {
  const newData = { ...data, tripInfo };
  saveData(newData);
  return newData;
};

// Calculate leaderboard
export const getLeaderboard = (data: AppData) => {
  return data.players
    .map((player) => {
      const playerScores = data.scores.filter((s) => s.playerId === player.id);
      const totalStrokes = playerScores.reduce((sum, s) => sum + s.total, 0);
      const roundsPlayed = playerScores.length;
      const todayScore = playerScores.length > 0 ? playerScores[playerScores.length - 1].total : 0;

      return {
        ...player,
        totalStrokes,
        roundsPlayed,
        todayScore,
      };
    })
    .sort((a, b) => {
      // Sort by total strokes (lower is better), then by handicap if tied
      if (a.roundsPlayed === 0 && b.roundsPlayed === 0) return a.number - b.number;
      if (a.roundsPlayed === 0) return 1;
      if (b.roundsPlayed === 0) return -1;
      return a.totalStrokes - b.totalStrokes;
    });
};
