// Constants for PROOF App

export const ROUNDS = [
  { number: 1, name: 'Round 1', course: 'Ponce de Leon', day: 'Friday AM' },
  { number: 2, name: 'Round 2', course: 'Balboa', day: 'Friday PM' },
  { number: 3, name: 'Round 3', course: 'Isabella', day: 'Saturday PM' },
  { number: 4, name: 'Round 4', course: 'Granada', day: 'Sunday AM (Championship)' },
];

export const HANDICAP_LABELS: Record<string, string> = {
  '0-5': 'Allegedly',
  '6-10': 'Decent on paper',
  '11-15': 'Weekend warrior',
  '16-20': 'Plays for the beer cart',
  '21-25': 'Cart path connoisseur',
  '26-30': 'Finds every bunker',
  '31-36': 'Just happy to be here',
  '37+': 'Bought clubs last week',
};

export const getHandicapLabel = (handicap: number): string => {
  if (handicap <= 5) return HANDICAP_LABELS['0-5'];
  if (handicap <= 10) return HANDICAP_LABELS['6-10'];
  if (handicap <= 15) return HANDICAP_LABELS['11-15'];
  if (handicap <= 20) return HANDICAP_LABELS['16-20'];
  if (handicap <= 25) return HANDICAP_LABELS['21-25'];
  if (handicap <= 30) return HANDICAP_LABELS['26-30'];
  if (handicap <= 36) return HANDICAP_LABELS['31-36'];
  return HANDICAP_LABELS['37+'];
};

export const ROAST_LINES = [
  "Definitely counting that mulligan",
  "His handicap is a work of fiction",
  "Blames the greens. Always.",
  "4 practice swings minimum",
  "Would be better if he stopped talking",
  "Thinks about the 19th hole by the 3rd",
  "His driver is for show",
  "Cart girl MVP",
  "Peaked in 2019",
  "Confidently incorrect",
  "The human rain delay",
  "Brings 12 clubs, uses 3",
  "GPS says 150, he's grabbing the 7 iron anyway",
  "The gallery is always wrong, not him",
  "Grip it and rip it. Mostly rip it.",
  "Breakfast ball enthusiast",
  "Thinks mulligans are in the rules",
  "The most confident bad golfer you'll meet",
  "Has never met a tree he couldn't hit",
  "Will definitely blame his equipment",
  "Allegedly scratch. Allegedly.",
  "His short game is just regular game",
  "The handicap is aspirational",
  "More range time than course time",
  "The vibes are strong, the scores are not",
];

export const PROOF_TYPES = [
  { value: 'glory', label: 'Proof of Glory', emoji: '🏆' },
  { value: 'disaster', label: 'Proof of Disaster', emoji: '💀' },
  { value: 'lies', label: 'Proof of Lies', emoji: '🧢' },
  { value: 'life', label: 'Proof of Life', emoji: '📸' },
  { value: 'challenge', label: 'Challenge Proof', emoji: '🎯' },
];

export const CAPTION_TEMPLATES = [
  "Proof.",
  "This happened.",
  "Witnessed.",
  "For the permanent record.",
  "Hall of fame material.",
  "Hall of shame material.",
  "The evidence.",
  "No comment.",
];

export const EMPTY_STATES = {
  scores: "Silence before the storm. Enter scores, cowards.",
  photos: "No proof? Did this even happen?",
  bets: "Put your money where your mouth is.",
  messages: "Someone say something stupid.",
  challenges: "All talk, no action.",
  predictions: "Too scared to guess?",
  quotes: "Nobody said anything worth remembering? Doubt it.",
};

export const TOAST_MESSAGES = {
  scoreSubmitted: "Locked in. No take-backs.",
  photoUploaded: "Stamped. This is canon now.",
  challengeClaimed: "Bold. Now prove it.",
  challengeVerified: "LEGEND. Points awarded.",
  challengeDisputed: "The people have spoken.",
  betCreated: "Oh, it's on.",
  betSettled: "Justice served.",
  quoteAdded: "Immortalized.",
};

export const CHALLENGE_CATEGORIES = [
  { id: 'drinking', label: 'Drinking', emoji: '🍺' },
  { id: 'golf', label: 'Golf', emoji: '⛳' },
  { id: 'food', label: 'Food', emoji: '🍳' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'dare', label: 'Dare', emoji: '😈' },
  { id: 'skill', label: 'Skill', emoji: '🎯' },
  { id: 'endurance', label: 'Endurance', emoji: '💪' },
];

export const REACTIONS = [
  { key: 'fire', emoji: '🔥', label: 'Fire' },
  { key: 'dead', emoji: '💀', label: 'Dead' },
  { key: 'laugh', emoji: '😂', label: 'Laugh' },
  { key: 'cap', emoji: '🧢', label: 'Cap' },
];
