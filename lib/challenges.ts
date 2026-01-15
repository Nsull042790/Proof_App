// 67 Challenges for PROOF App

import { Challenge } from './types';
import { generateId } from './utils';

export const INITIAL_CHALLENGES: Omit<Challenge, 'id' | 'status' | 'claimedBy' | 'verifiedBy' | 'disputedBy' | 'proofPhotoId'>[] = [
  // DRINKING CHALLENGES (15)
  { title: "Shotgun Speedrun", description: "Under 5 seconds. Timer required.", points: 10, category: "drinking", proofRequired: true, witnessRequired: true },
  { title: "Flip Cup Champion", description: "Win 3 games in a row", points: 15, category: "drinking", proofRequired: true, witnessRequired: true },
  { title: "Beer Golf", description: "Finish a beer every 3 holes", points: 20, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "First to the Bar", description: "Order a drink before anyone else at the 19th", points: 5, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "The Hydrator", description: "Drink water between every alcoholic drink for 1 round", points: 10, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "Shot for Birdie", description: "Take a shot for every birdie you make", points: 15, category: "drinking", proofRequired: true, witnessRequired: true },
  { title: "The Designated", description: "Stay sober for an entire round", points: 25, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "Cart Beer Mile", description: "Finish 4 beers on 4 different holes", points: 15, category: "drinking", proofRequired: true, witnessRequired: false },
  { title: "Drink the Menu", description: "Order something you've never had before", points: 5, category: "drinking", proofRequired: true, witnessRequired: false },
  { title: "Toast Master", description: "Give a toast at dinner", points: 10, category: "drinking", proofRequired: true, witnessRequired: true },
  { title: "Never Have I Ever", description: "Win a round of Never Have I Ever", points: 10, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "Kings Cup Survivor", description: "Make it through Kings Cup without losing", points: 15, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "The Closer", description: "Be the last one standing at the bar", points: 20, category: "drinking", proofRequired: false, witnessRequired: true },
  { title: "Morning Beer", description: "Crack a cold one before 9am", points: 10, category: "drinking", proofRequired: true, witnessRequired: false },
  { title: "The Ambassador", description: "Buy a drink for a stranger", points: 10, category: "drinking", proofRequired: true, witnessRequired: true },

  // GOLF CHALLENGES (15)
  { title: "Birdie Hunt", description: "Make a birdie", points: 20, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "Eagle Eye", description: "Make an eagle", points: 50, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "Sandy Par", description: "Get up and down from a bunker for par", points: 15, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "Long Bomb", description: "Hit a drive over 280 yards", points: 15, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "One Putt Wonder", description: "One-putt 5 greens in a round", points: 20, category: "golf", proofRequired: false, witnessRequired: false },
  { title: "The Houdini", description: "Make par from a seemingly impossible spot", points: 25, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "Pin Hunter", description: "Hit 3 greens in regulation in a row", points: 15, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "No Water Round", description: "Complete a round without hitting into water", points: 15, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "Beat Your Handicap", description: "Shoot better than your handicap", points: 30, category: "golf", proofRequired: false, witnessRequired: false },
  { title: "The Scrambler", description: "Save par after missing the fairway AND green", points: 20, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "First Blood", description: "Win the first hole of a round in your foursome", points: 10, category: "golf", proofRequired: false, witnessRequired: true },
  { title: "Longest Drive Winner", description: "Win longest drive on any hole", points: 15, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "Closest to Pin", description: "Win closest to the pin on a par 3", points: 15, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "The Grinder", description: "Make a putt over 20 feet", points: 15, category: "golf", proofRequired: true, witnessRequired: true },
  { title: "No Lost Balls", description: "Play a full round without losing a ball", points: 20, category: "golf", proofRequired: false, witnessRequired: true },

  // FOOD CHALLENGES (10)
  { title: "Breakfast Champion", description: "Eat the biggest breakfast", points: 10, category: "food", proofRequired: true, witnessRequired: true },
  { title: "Grill Master", description: "Cook for the group", points: 20, category: "food", proofRequired: true, witnessRequired: true },
  { title: "Clean Plate Club", description: "Finish everything you order at dinner", points: 5, category: "food", proofRequired: false, witnessRequired: true },
  { title: "Late Night Snack Attack", description: "Make food for others after midnight", points: 15, category: "food", proofRequired: true, witnessRequired: true },
  { title: "The Critic", description: "Give a dramatic food review", points: 10, category: "food", proofRequired: true, witnessRequired: true },
  { title: "Hot Sauce Hero", description: "Put hot sauce on everything for a meal", points: 10, category: "food", proofRequired: true, witnessRequired: true },
  { title: "Pizza Face", description: "Order pizza at midnight or later", points: 10, category: "food", proofRequired: true, witnessRequired: false },
  { title: "Course Snack King", description: "Share snacks with your foursome all round", points: 10, category: "food", proofRequired: false, witnessRequired: true },
  { title: "Local Specialty", description: "Try a local food specialty", points: 10, category: "food", proofRequired: true, witnessRequired: false },
  { title: "Dessert First", description: "Order dessert before your main course", points: 10, category: "food", proofRequired: true, witnessRequired: true },

  // SOCIAL CHALLENGES (10)
  { title: "Story Time", description: "Tell a story that makes everyone laugh", points: 15, category: "social", proofRequired: true, witnessRequired: true },
  { title: "The Complimenter", description: "Give every player a genuine compliment", points: 15, category: "social", proofRequired: false, witnessRequired: true },
  { title: "Phone Stack", description: "Win a phone stack game at dinner", points: 10, category: "social", proofRequired: false, witnessRequired: true },
  { title: "Dance Floor Hero", description: "Be the first one dancing", points: 15, category: "social", proofRequired: true, witnessRequired: true },
  { title: "Karaoke King", description: "Sing karaoke (if available)", points: 20, category: "social", proofRequired: true, witnessRequired: true },
  { title: "The Connector", description: "Get a stranger's phone number", points: 20, category: "social", proofRequired: true, witnessRequired: true },
  { title: "Group Photo Organizer", description: "Organize a full group photo", points: 10, category: "social", proofRequired: true, witnessRequired: false },
  { title: "Memory Lane", description: "Share a story from a previous trip", points: 10, category: "social", proofRequired: false, witnessRequired: true },
  { title: "The Hype Man", description: "Celebrate someone else's shot like it was yours", points: 10, category: "social", proofRequired: true, witnessRequired: true },
  { title: "Inside Joke Creator", description: "Start a new inside joke that sticks", points: 15, category: "social", proofRequired: false, witnessRequired: true },

  // DARE CHALLENGES (10)
  { title: "Cold Plunge", description: "Jump in the pool with clothes on", points: 25, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "The Streaker", description: "Run across a fairway (when clear)", points: 30, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "Accent Round", description: "Speak in an accent for an entire hole", points: 15, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "Wrong Hand", description: "Play a hole with opposite hand clubs", points: 15, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "The Announcer", description: "Announce your shots like a golf commentator for a hole", points: 10, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "Fashion Forward", description: "Wear something ridiculous for a round", points: 15, category: "dare", proofRequired: true, witnessRequired: false },
  { title: "Eyes Wide Shut", description: "Make a putt with your eyes closed", points: 20, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "Happy Gilmore", description: "Tee off Happy Gilmore style", points: 15, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "The Crooner", description: "Sing to your ball before a shot", points: 10, category: "dare", proofRequired: true, witnessRequired: true },
  { title: "Barefoot Golf", description: "Play a hole barefoot", points: 15, category: "dare", proofRequired: true, witnessRequired: true },

  // SKILL CHALLENGES (5)
  { title: "Chip In", description: "Chip in from off the green", points: 25, category: "skill", proofRequired: true, witnessRequired: true },
  { title: "Flop Shot Master", description: "Successfully execute a flop shot", points: 15, category: "skill", proofRequired: true, witnessRequired: true },
  { title: "Stinger", description: "Hit a low punch shot under a tree", points: 15, category: "skill", proofRequired: true, witnessRequired: true },
  { title: "The Draw", description: "Hit an intentional draw on command", points: 15, category: "skill", proofRequired: true, witnessRequired: true },
  { title: "The Fade", description: "Hit an intentional fade on command", points: 15, category: "skill", proofRequired: true, witnessRequired: true },

  // ENDURANCE CHALLENGES (2)
  { title: "Iron Man", description: "Walk a full round (no cart)", points: 30, category: "endurance", proofRequired: false, witnessRequired: true },
  { title: "Dawn Patrol", description: "Be first one awake for 3 days straight", points: 25, category: "endurance", proofRequired: false, witnessRequired: true },
];

export const createInitialChallenges = (): Challenge[] => {
  return INITIAL_CHALLENGES.map((challenge) => ({
    ...challenge,
    id: generateId(),
    status: 'open' as const,
    claimedBy: null,
    verifiedBy: [],
    disputedBy: [],
    proofPhotoId: null,
  }));
};
