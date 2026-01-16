// Core Types for PROOF App

export interface Player {
  id: string;
  number: number;
  name: string;
  nickname: string;
  handicap: number;
  avatar: string | null;
  challengePoints: number;
  predictionPoints: number;
}

export interface Score {
  id: string;
  playerId: string;
  roundNumber: number; // 1-4
  holeScores: number[]; // 18 values
  total: number;
  blooperNote: string;
  createdAt: string;
}

export interface Foursomes {
  round1: string[][];
  round2: string[][];
  round3: string[][];
  round4: string[][];
}

export interface Photo {
  id: string;
  uploadedBy: string;
  imageData: string; // base64 for demo
  caption: string;
  proofType: 'glory' | 'disaster' | 'lies' | 'life' | 'challenge';
  taggedPlayers: string[];
  reactions: Reactions;
  createdAt: string;
}

export interface Reactions {
  fire: number;
  dead: number;
  laugh: number;
  cap: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'drinking' | 'golf' | 'food' | 'social' | 'dare' | 'skill' | 'endurance';
  proofRequired: boolean;
  witnessRequired: boolean;
  status: 'open' | 'claimed' | 'verified' | 'disputed';
  claimedBy: string | null;
  verifiedBy: string[];
  disputedBy: string[];
  proofPhotoId: string | null;
}

export interface Bet {
  id: string;
  description: string;
  playersInvolved: string[];
  stakes: string;
  status: 'open' | 'settled';
  winner: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Message {
  id: string;
  playerId: string;
  content: string;
  reactions: Reactions;
  createdAt: string;
}

export interface Quote {
  id: string;
  content: string;
  saidBy: string;
  context: string;
  reactions: Reactions;
  createdAt: string;
}

export interface Prediction {
  id: string;
  playerId: string;
  roundNumber: number;
  predictedWinner: string;
  ownOverUnder: number;
  firstWater: string;
  most3Putts: string;
  createdAt: string;
}

export interface TimeCapsuleEntry {
  playerId: string;
  tripWinner: string;
  tripLast: string;
  secretGoal: string;
  prediction: string;
  messageToSelf: string;
  createdAt: string;
}

// Night Games Types
export interface NightGame {
  id: string;
  name: string;
  type: 'irl' | 'app'; // IRL = real world game, app = in-app game
  scores: NightGameScore[];
  createdAt: string;
  status: 'active' | 'finished';
}

export interface NightGameScore {
  playerId: string;
  score: number; // Can be points, wins, or any numeric value
  place?: number; // 1st, 2nd, 3rd for finished games
}

export interface MostLikelyToRound {
  id: string;
  prompt: string;
  votes: { [voterId: string]: string }; // voterId -> votedForPlayerId
  winner?: string;
  createdAt: string;
}

export interface WouldYouRatherRound {
  id: string;
  optionA: string;
  optionB: string;
  votes: { [playerId: string]: 'A' | 'B' };
  createdAt: string;
}

export interface ItineraryNotes {
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  monday: string[];
}

export interface TripInfo {
  houseAddress: string;
  doorCode: string;
  wifiPassword: string;
  emergencyContact: string;
  nearestHospital: string;
  localPizza: string;
}

export interface AppData {
  players: Player[];
  currentPlayerId: string | null;
  scores: Score[];
  foursomes: Foursomes;
  photos: Photo[];
  challenges: Challenge[];
  bets: Bet[];
  messages: Message[];
  quotes: Quote[];
  predictions: Prediction[];
  timeCapsule: TimeCapsuleEntry[];
  itineraryNotes: ItineraryNotes;
  tripInfo: TripInfo;
  nightGames: NightGame[];
  mostLikelyTo: MostLikelyToRound[];
  wouldYouRather: WouldYouRatherRound[];
}
