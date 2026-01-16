'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppData, Player, Score, Photo, Challenge, Bet, Message, Quote, Prediction, TimeCapsuleEntry, Foursomes, ItineraryNotes, TripInfo } from '@/lib/types';
import * as dataHelpers from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { createInitialChallenges } from '@/lib/challenges';
import { RealtimeChannel } from '@supabase/supabase-js';

interface DataContextType {
  data: AppData;
  isLoading: boolean;
  isOnline: boolean;
  currentPlayerId: string | null;

  // Player methods
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setCurrentPlayer: (playerId: string) => void;
  getPlayerById: (playerId: string) => Player | undefined;

  // Score methods
  addScore: (score: Omit<Score, 'id' | 'createdAt'>) => void;
  getPlayerScores: (playerId: string) => Score[];
  getRoundScores: (roundNumber: number) => Score[];

  // Photo methods
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt' | 'reactions'>) => void;
  reactToPhoto: (photoId: string, reaction: keyof Photo['reactions']) => void;
  uploadPhoto: (file: File) => Promise<string | null>;
  deletePhoto: (photoId: string) => Promise<boolean>;

  // Refresh
  refreshData: () => Promise<void>;

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

// Convert Supabase player row to our Player type
const mapPlayer = (row: any): Player => ({
  id: row.id,
  number: row.number,
  name: row.name,
  nickname: row.nickname || '',
  handicap: row.handicap,
  avatar: row.avatar,
  challengePoints: row.challenge_points,
  predictionPoints: row.prediction_points,
});

// Convert Supabase score row to our Score type
const mapScore = (row: any): Score => ({
  id: row.id,
  playerId: row.player_id,
  roundNumber: row.round_number,
  holeScores: row.hole_scores || [],
  total: row.total,
  blooperNote: row.blooper_note || '',
  createdAt: row.created_at,
});

// Convert Supabase photo row to our Photo type
const mapPhoto = (row: any): Photo => ({
  id: row.id,
  uploadedBy: row.uploaded_by,
  imageData: row.image_url,
  caption: row.caption,
  proofType: row.proof_type,
  taggedPlayers: row.tagged_players || [],
  reactions: {
    fire: row.reactions_fire || 0,
    dead: row.reactions_dead || 0,
    laugh: row.reactions_laugh || 0,
    cap: row.reactions_cap || 0,
  },
  createdAt: row.created_at,
});

// Convert Supabase challenge row to our Challenge type
const mapChallenge = (row: any): Challenge => ({
  id: row.id,
  title: row.title,
  description: row.description,
  points: row.points,
  category: row.category,
  proofRequired: row.proof_required,
  witnessRequired: row.witness_required,
  status: row.status,
  claimedBy: row.claimed_by,
  verifiedBy: row.verified_by || [],
  disputedBy: row.disputed_by || [],
  proofPhotoId: row.proof_photo_id,
});

// Convert Supabase message row to our Message type
const mapMessage = (row: any): Message => ({
  id: row.id,
  playerId: row.player_id,
  content: row.content,
  reactions: {
    fire: row.reactions_fire || 0,
    dead: row.reactions_dead || 0,
    laugh: row.reactions_laugh || 0,
    cap: row.reactions_cap || 0,
  },
  createdAt: row.created_at,
});

// Convert Supabase quote row to our Quote type
const mapQuote = (row: any): Quote => ({
  id: row.id,
  content: row.content,
  saidBy: row.said_by,
  context: row.context || '',
  reactions: {
    fire: row.reactions_fire || 0,
    dead: row.reactions_dead || 0,
    laugh: row.reactions_laugh || 0,
    cap: row.reactions_cap || 0,
  },
  createdAt: row.created_at,
});

// Convert Supabase bet row to our Bet type
const mapBet = (row: any): Bet => ({
  id: row.id,
  description: row.description,
  playersInvolved: row.players_involved || [],
  stakes: row.stakes,
  status: row.status,
  winner: row.winner,
  createdBy: row.created_by,
  createdAt: row.created_at,
});

// Convert Supabase prediction row to our Prediction type
const mapPrediction = (row: any): Prediction => ({
  id: row.id,
  playerId: row.player_id,
  roundNumber: row.round_number,
  predictedWinner: row.predicted_winner,
  ownOverUnder: row.own_over_under,
  firstWater: row.first_water,
  most3Putts: row.most_3_putts,
  createdAt: row.created_at,
});

// Convert Supabase time capsule row to our TimeCapsuleEntry type
const mapTimeCapsule = (row: any): TimeCapsuleEntry => ({
  playerId: row.player_id,
  tripWinner: row.trip_winner,
  tripLast: row.trip_last,
  secretGoal: row.secret_goal || '',
  prediction: row.prediction || '',
  messageToSelf: row.message_to_self || '',
  createdAt: row.created_at,
});

// Helper to get current player ID from localStorage (runs on client only)
const getStoredCurrentPlayerId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('proof-current-player');
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Separate state for currentPlayerId - initialized to null, then synced from localStorage
  const [currentPlayerId, setCurrentPlayerIdState] = useState<string | null>(null);

  // Sync currentPlayerId from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem('proof-current-player');
    if (stored) {
      setCurrentPlayerIdState(stored);
    }
  }, []);

  // Initial data load from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from Supabase
        const [
          playersRes,
          scoresRes,
          photosRes,
          challengesRes,
          betsRes,
          messagesRes,
          quotesRes,
          predictionsRes,
          timeCapsuleRes,
          tripInfoRes,
          itineraryRes,
        ] = await Promise.all([
          supabase.from('players').select('*').order('number'),
          supabase.from('scores').select('*').order('created_at', { ascending: false }),
          supabase.from('photos').select('*').order('created_at', { ascending: false }),
          supabase.from('challenges').select('*').order('points', { ascending: false }),
          supabase.from('bets').select('*').order('created_at', { ascending: false }),
          supabase.from('messages').select('*').order('created_at'),
          supabase.from('quotes').select('*').order('created_at', { ascending: false }),
          supabase.from('predictions').select('*'),
          supabase.from('time_capsule').select('*'),
          supabase.from('trip_info').select('*').single(),
          supabase.from('itinerary_notes').select('*'),
        ]);

        // Check if we got data from Supabase
        if (playersRes.data && playersRes.data.length > 0) {
          setIsOnline(true);

          // Map foursomes (not stored in foursomes table in this implementation)
          const foursomes: Foursomes = {
            round1: [[], [], []],
            round2: [[], [], []],
            round3: [[], [], []],
            round4: [[], [], []],
          };

          // Map itinerary notes
          const itineraryNotes: ItineraryNotes = {
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
            monday: [],
          };

          if (itineraryRes.data) {
            itineraryRes.data.forEach((row: any) => {
              if (row.day in itineraryNotes) {
                itineraryNotes[row.day as keyof ItineraryNotes] = row.notes || [];
              }
            });
          }

          // Get challenges - if none exist in DB, use default ones
          let challenges: Challenge[] = [];
          if (challengesRes.data && challengesRes.data.length > 0) {
            challenges = challengesRes.data.map(mapChallenge);
          } else {
            // Insert default challenges
            challenges = createInitialChallenges();
            const challengesToInsert = challenges.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              points: c.points,
              category: c.category,
              proof_required: c.proofRequired,
              witness_required: c.witnessRequired,
              status: c.status,
              claimed_by: c.claimedBy,
              verified_by: c.verifiedBy,
              disputed_by: c.disputedBy,
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await supabase.from('challenges').insert(challengesToInsert as any);
          }

          const players = playersRes.data.map(mapPlayer);

          const loadedData: AppData = {
            players,
            currentPlayerId: null, // Will be synced from localStorage by the useEffect
            scores: scoresRes.data?.map(mapScore) || [],
            foursomes,
            photos: photosRes.data?.map(mapPhoto) || [],
            challenges,
            bets: betsRes.data?.map(mapBet) || [],
            messages: messagesRes.data?.map(mapMessage) || [],
            quotes: quotesRes.data?.map(mapQuote) || [],
            predictions: predictionsRes.data?.map(mapPrediction) || [],
            timeCapsule: timeCapsuleRes.data?.map(mapTimeCapsule) || [],
            itineraryNotes,
            tripInfo: (tripInfoRes.data as any) ? {
              houseAddress: (tripInfoRes.data as any).house_address,
              doorCode: (tripInfoRes.data as any).door_code,
              wifiPassword: (tripInfoRes.data as any).wifi_password,
              emergencyContact: (tripInfoRes.data as any).emergency_contact,
              nearestHospital: (tripInfoRes.data as any).nearest_hospital,
              localPizza: (tripInfoRes.data as any).local_pizza,
            } : dataHelpers.loadData().tripInfo,
            nightGames: [],
            mostLikelyTo: [],
            wouldYouRather: [],
          };

          setData(loadedData);
        } else {
          // Fall back to localStorage
          console.log('Supabase not configured or empty, using localStorage');
          setIsOnline(false);
          const loadedData = dataHelpers.loadData();
          setData(loadedData);
        }
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        setIsOnline(false);
        const loadedData = dataHelpers.loadData();
        setData(loadedData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isOnline) return;

    const channel = supabase
      .channel('proof-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              players: prev.players.map((p) =>
                p.id === payload.new.id ? mapPlayer(payload.new) : p
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newScore = mapScore(payload.new);
            const exists = prev.scores.some((s) => s.id === newScore.id);
            if (exists) return prev;
            return { ...prev, scores: [newScore, ...prev.scores] };
          }
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              scores: prev.scores.map((s) =>
                s.id === payload.new.id ? mapScore(payload.new) : s
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newPhoto = mapPhoto(payload.new);
            const exists = prev.photos.some((p) => p.id === newPhoto.id);
            if (exists) return prev;
            return { ...prev, photos: [newPhoto, ...prev.photos] };
          }
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              photos: prev.photos.map((p) =>
                p.id === payload.new.id ? mapPhoto(payload.new) : p
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              challenges: prev.challenges.map((c) =>
                c.id === payload.new.id ? mapChallenge(payload.new) : c
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newMessage = mapMessage(payload.new);
            const exists = prev.messages.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return { ...prev, messages: [...prev.messages, newMessage] };
          }
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              messages: prev.messages.map((m) =>
                m.id === payload.new.id ? mapMessage(payload.new) : m
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newQuote = mapQuote(payload.new);
            const exists = prev.quotes.some((q) => q.id === newQuote.id);
            if (exists) return prev;
            return { ...prev, quotes: [newQuote, ...prev.quotes] };
          }
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              quotes: prev.quotes.map((q) =>
                q.id === payload.new.id ? mapQuote(payload.new) : q
              ),
            };
          }
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bets' }, (payload) => {
        setData((prev) => {
          if (!prev) return prev;
          if (payload.eventType === 'INSERT' && payload.new) {
            const newBet = mapBet(payload.new);
            const exists = prev.bets.some((b) => b.id === newBet.id);
            if (exists) return prev;
            return { ...prev, bets: [newBet, ...prev.bets] };
          }
          if (payload.eventType === 'UPDATE' && payload.new) {
            return {
              ...prev,
              bets: prev.bets.map((b) =>
                b.id === payload.new.id ? mapBet(payload.new) : b
              ),
            };
          }
          return prev;
        });
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [isOnline]);

  // Player methods
  const updatePlayer = useCallback(async (playerId: string, updates: Partial<Player>) => {
    if (isOnline) {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
      if (updates.handicap !== undefined) dbUpdates.handicap = updates.handicap;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.challengePoints !== undefined) dbUpdates.challenge_points = updates.challengePoints;
      if (updates.predictionPoints !== undefined) dbUpdates.prediction_points = updates.predictionPoints;
      dbUpdates.updated_at = new Date().toISOString();

      await supabase.from('players').update(dbUpdates).eq('id', playerId);
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, ...updates } : p
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const setCurrentPlayer = useCallback((playerId: string) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('proof-current-player', playerId);
    }
    // Update the dedicated currentPlayerId state (triggers immediate re-render)
    setCurrentPlayerIdState(playerId);
    // Also update data state for consistency
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, currentPlayerId: playerId };
    });
  }, []);

  const getPlayerById = useCallback((playerId: string) => {
    if (!data) return undefined;
    return data.players.find((p) => p.id === playerId);
  }, [data]);

  // Score methods
  const addScore = useCallback(async (score: Omit<Score, 'id' | 'createdAt'>) => {
    const newScore: Score = {
      ...score,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('scores').upsert({
        id: newScore.id,
        player_id: newScore.playerId,
        round_number: newScore.roundNumber,
        hole_scores: newScore.holeScores,
        total: newScore.total,
        blooper_note: newScore.blooperNote,
        created_at: newScore.createdAt,
      }, { onConflict: 'player_id,round_number' });
    }

    setData((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.scores.findIndex(
        (s) => s.playerId === score.playerId && s.roundNumber === score.roundNumber
      );
      let newScores: Score[];
      if (existingIndex >= 0) {
        newScores = [...prev.scores];
        newScores[existingIndex] = newScore;
      } else {
        newScores = [newScore, ...prev.scores];
      }
      const newData = { ...prev, scores: newScores };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const getPlayerScores = useCallback((playerId: string) => {
    if (!data) return [];
    return data.scores.filter((s) => s.playerId === playerId);
  }, [data]);

  const getRoundScores = useCallback((roundNumber: number) => {
    if (!data) return [];
    return data.scores.filter((s) => s.roundNumber === roundNumber);
  }, [data]);

  // Photo methods
  const uploadPhoto = useCallback(async (file: File): Promise<string | null> => {
    if (!isOnline) {
      // Fall back to base64 for localStorage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  }, [isOnline]);

  const addPhoto = useCallback(async (photo: Omit<Photo, 'id' | 'createdAt' | 'reactions'>) => {
    const newPhoto: Photo = {
      ...photo,
      id: crypto.randomUUID(),
      reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('photos').insert({
        id: newPhoto.id,
        uploaded_by: newPhoto.uploadedBy,
        image_url: newPhoto.imageData,
        caption: newPhoto.caption,
        proof_type: newPhoto.proofType,
        tagged_players: newPhoto.taggedPlayers,
        created_at: newPhoto.createdAt,
      });
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, photos: [newPhoto, ...prev.photos] };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const reactToPhoto = useCallback(async (photoId: string, reaction: keyof Photo['reactions']) => {
    if (isOnline) {
      const column = `reactions_${reaction}`;
      const photo = data?.photos.find((p) => p.id === photoId);
      if (photo) {
        await supabase.from('photos').update({
          [column]: photo.reactions[reaction] + 1,
        }).eq('id', photoId);
      }
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        photos: prev.photos.map((p) =>
          p.id === photoId
            ? { ...p, reactions: { ...p.reactions, [reaction]: p.reactions[reaction] + 1 } }
            : p
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline, data]);

  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    try {
      const photo = data?.photos.find((p) => p.id === photoId);
      if (!photo) return false;

      if (isOnline) {
        // Delete from Supabase
        const { error } = await supabase.from('photos').delete().eq('id', photoId);
        if (error) throw error;

        // Try to delete from storage if it's a Supabase URL
        if (photo.imageData.includes('supabase')) {
          const fileName = photo.imageData.split('/').pop();
          if (fileName) {
            await supabase.storage.from('photos').remove([fileName]);
          }
        }
      }

      setData((prev) => {
        if (!prev) return prev;
        const newData = { ...prev, photos: prev.photos.filter((p) => p.id !== photoId) };
        if (!isOnline) dataHelpers.saveData(newData);
        return newData;
      });

      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }, [isOnline, data]);

  // Challenge methods
  const claimChallenge = useCallback(async (challengeId: string, playerId: string) => {
    if (isOnline) {
      await supabase.from('challenges').update({
        status: 'claimed',
        claimed_by: playerId,
      }).eq('id', challengeId);
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        challenges: prev.challenges.map((c) =>
          c.id === challengeId ? { ...c, status: 'claimed' as const, claimedBy: playerId } : c
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const verifyChallenge = useCallback(async (challengeId: string, verifierId: string) => {
    const challenge = data?.challenges.find((c) => c.id === challengeId);
    if (!challenge || !challenge.claimedBy) return;

    const newVerifiedBy = [...challenge.verifiedBy, verifierId];
    const isVerified = newVerifiedBy.length >= 2;

    if (isOnline) {
      await supabase.from('challenges').update({
        verified_by: newVerifiedBy,
        status: isVerified ? 'verified' : 'claimed',
      }).eq('id', challengeId);

      if (isVerified) {
        const player = data?.players.find((p) => p.id === challenge.claimedBy);
        if (player) {
          await supabase.from('players').update({
            challenge_points: player.challengePoints + challenge.points,
          }).eq('id', challenge.claimedBy);
        }
      }
    }

    setData((prev) => {
      if (!prev) return prev;

      let newPlayers = prev.players;
      if (isVerified) {
        newPlayers = prev.players.map((p) =>
          p.id === challenge.claimedBy
            ? { ...p, challengePoints: p.challengePoints + challenge.points }
            : p
        );
      }

      const newData = {
        ...prev,
        players: newPlayers,
        challenges: prev.challenges.map((c) =>
          c.id === challengeId
            ? { ...c, verifiedBy: newVerifiedBy, status: isVerified ? 'verified' as const : c.status }
            : c
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline, data]);

  const disputeChallenge = useCallback(async (challengeId: string, disputerId: string) => {
    const challenge = data?.challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const newDisputedBy = [...challenge.disputedBy, disputerId];
    const isDisputed = newDisputedBy.length >= 3;

    if (isOnline) {
      if (isDisputed) {
        await supabase.from('challenges').update({
          status: 'open',
          claimed_by: null,
          verified_by: [],
          disputed_by: [],
        }).eq('id', challengeId);
      } else {
        await supabase.from('challenges').update({
          disputed_by: newDisputedBy,
        }).eq('id', challengeId);
      }
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        challenges: prev.challenges.map((c) =>
          c.id === challengeId
            ? isDisputed
              ? { ...c, status: 'open' as const, claimedBy: null, verifiedBy: [], disputedBy: [] }
              : { ...c, disputedBy: newDisputedBy }
            : c
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline, data]);

  // Bet methods
  const addBet = useCallback(async (bet: Omit<Bet, 'id' | 'createdAt' | 'status' | 'winner'>) => {
    const newBet: Bet = {
      ...bet,
      id: crypto.randomUUID(),
      status: 'open',
      winner: null,
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('bets').insert({
        id: newBet.id,
        description: newBet.description,
        players_involved: newBet.playersInvolved,
        stakes: newBet.stakes,
        status: newBet.status,
        created_by: newBet.createdBy,
        created_at: newBet.createdAt,
      });
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, bets: [newBet, ...prev.bets] };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const settleBet = useCallback(async (betId: string, winnerId: string) => {
    if (isOnline) {
      await supabase.from('bets').update({
        status: 'settled',
        winner: winnerId,
      }).eq('id', betId);
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        bets: prev.bets.map((b) =>
          b.id === betId ? { ...b, status: 'settled' as const, winner: winnerId } : b
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  // Message methods
  const addMessage = useCallback(async (message: Omit<Message, 'id' | 'createdAt' | 'reactions'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('messages').insert({
        id: newMessage.id,
        player_id: newMessage.playerId,
        content: newMessage.content,
        created_at: newMessage.createdAt,
      });
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, messages: [...prev.messages, newMessage] };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const reactToMessage = useCallback(async (messageId: string, reaction: keyof Message['reactions']) => {
    if (isOnline) {
      const column = `reactions_${reaction}`;
      const message = data?.messages.find((m) => m.id === messageId);
      if (message) {
        await supabase.from('messages').update({
          [column]: message.reactions[reaction] + 1,
        }).eq('id', messageId);
      }
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === messageId
            ? { ...m, reactions: { ...m.reactions, [reaction]: m.reactions[reaction] + 1 } }
            : m
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline, data]);

  // Quote methods
  const addQuote = useCallback(async (quote: Omit<Quote, 'id' | 'createdAt' | 'reactions'>) => {
    const newQuote: Quote = {
      ...quote,
      id: crypto.randomUUID(),
      reactions: { fire: 0, dead: 0, laugh: 0, cap: 0 },
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('quotes').insert({
        id: newQuote.id,
        content: newQuote.content,
        said_by: newQuote.saidBy,
        context: newQuote.context,
        created_at: newQuote.createdAt,
      });
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, quotes: [newQuote, ...prev.quotes] };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  const reactToQuote = useCallback(async (quoteId: string, reaction: keyof Quote['reactions']) => {
    if (isOnline) {
      const column = `reactions_${reaction}`;
      const quote = data?.quotes.find((q) => q.id === quoteId);
      if (quote) {
        await supabase.from('quotes').update({
          [column]: quote.reactions[reaction] + 1,
        }).eq('id', quoteId);
      }
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = {
        ...prev,
        quotes: prev.quotes.map((q) =>
          q.id === quoteId
            ? { ...q, reactions: { ...q.reactions, [reaction]: q.reactions[reaction] + 1 } }
            : q
        ),
      };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline, data]);

  // Prediction methods
  const addPrediction = useCallback(async (prediction: Omit<Prediction, 'id' | 'createdAt'>) => {
    const newPrediction: Prediction = {
      ...prediction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('predictions').upsert({
        id: newPrediction.id,
        player_id: newPrediction.playerId,
        round_number: newPrediction.roundNumber,
        predicted_winner: newPrediction.predictedWinner,
        own_over_under: newPrediction.ownOverUnder,
        first_water: newPrediction.firstWater,
        most_3_putts: newPrediction.most3Putts,
        created_at: newPrediction.createdAt,
      }, { onConflict: 'player_id,round_number' });
    }

    setData((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.predictions.findIndex(
        (p) => p.playerId === prediction.playerId && p.roundNumber === prediction.roundNumber
      );
      let newPredictions: Prediction[];
      if (existingIndex >= 0) {
        newPredictions = [...prev.predictions];
        newPredictions[existingIndex] = newPrediction;
      } else {
        newPredictions = [...prev.predictions, newPrediction];
      }
      const newData = { ...prev, predictions: newPredictions };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  // Time Capsule methods
  const addTimeCapsuleEntry = useCallback(async (entry: Omit<TimeCapsuleEntry, 'createdAt'>) => {
    const newEntry: TimeCapsuleEntry = {
      ...entry,
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      await supabase.from('time_capsule').upsert({
        player_id: newEntry.playerId,
        trip_winner: newEntry.tripWinner,
        trip_last: newEntry.tripLast,
        secret_goal: newEntry.secretGoal,
        prediction: newEntry.prediction,
        message_to_self: newEntry.messageToSelf,
        created_at: newEntry.createdAt,
      }, { onConflict: 'player_id' });
    }

    setData((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.timeCapsule.findIndex((e) => e.playerId === entry.playerId);
      let newTimeCapsule: TimeCapsuleEntry[];
      if (existingIndex >= 0) {
        newTimeCapsule = [...prev.timeCapsule];
        newTimeCapsule[existingIndex] = newEntry;
      } else {
        newTimeCapsule = [...prev.timeCapsule, newEntry];
      }
      const newData = { ...prev, timeCapsule: newTimeCapsule };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  // Foursomes methods
  const updateFoursomes = useCallback((foursomes: Foursomes) => {
    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, foursomes };
      dataHelpers.saveData(newData);
      return newData;
    });
  }, []);

  // Itinerary methods
  const updateItineraryNotes = useCallback(async (notes: ItineraryNotes) => {
    if (isOnline) {
      for (const [day, dayNotes] of Object.entries(notes)) {
        await supabase.from('itinerary_notes').upsert({
          day,
          notes: dayNotes,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'day' });
      }
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, itineraryNotes: notes };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  // Trip info methods
  const updateTripInfo = useCallback(async (tripInfo: TripInfo) => {
    if (isOnline) {
      await supabase.from('trip_info').update({
        house_address: tripInfo.houseAddress,
        door_code: tripInfo.doorCode,
        wifi_password: tripInfo.wifiPassword,
        emergency_contact: tripInfo.emergencyContact,
        nearest_hospital: tripInfo.nearestHospital,
        local_pizza: tripInfo.localPizza,
        updated_at: new Date().toISOString(),
      }).neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows
    }

    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, tripInfo };
      if (!isOnline) dataHelpers.saveData(newData);
      return newData;
    });
  }, [isOnline]);

  // Leaderboard
  const getLeaderboard = useCallback(() => {
    if (!data) return [];
    return dataHelpers.getLeaderboard(data);
  }, [data]);

  // Refresh data from server
  const refreshData = useCallback(async () => {
    if (!isOnline) return;

    try {
      const [
        playersRes,
        scoresRes,
        photosRes,
        messagesRes,
        quotesRes,
        betsRes,
      ] = await Promise.all([
        supabase.from('players').select('*').order('number'),
        supabase.from('scores').select('*').order('created_at', { ascending: false }),
        supabase.from('photos').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at'),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('bets').select('*').order('created_at', { ascending: false }),
      ]);

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: playersRes.data?.map(mapPlayer) || prev.players,
          scores: scoresRes.data?.map(mapScore) || prev.scores,
          photos: photosRes.data?.map(mapPhoto) || prev.photos,
          messages: messagesRes.data?.map(mapMessage) || prev.messages,
          quotes: quotesRes.data?.map(mapQuote) || prev.quotes,
          bets: betsRes.data?.map(mapBet) || prev.bets,
        };
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [isOnline]);

  // Reset
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
        isOnline,
        currentPlayerId,
        updatePlayer,
        setCurrentPlayer,
        getPlayerById,
        addScore,
        getPlayerScores,
        getRoundScores,
        addPhoto,
        reactToPhoto,
        uploadPhoto,
        deletePhoto,
        refreshData,
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
