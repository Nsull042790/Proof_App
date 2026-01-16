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

// Night Games
export const MOST_LIKELY_TO_PROMPTS = [
  "Most likely to black out tonight",
  "Most likely to start a fight",
  "Most likely to puke before midnight",
  "Most likely to lose all their money gambling",
  "Most likely to talk sh*t then not back it up",
  "Most likely to pass out with shoes on",
  "Most likely to wake up in the wrong bed",
  "Most likely to cheat at cards",
  "Most likely to break something expensive",
  "Most likely to get way too competitive",
  "Most likely to claim they can outdrink everyone",
  "Most likely to make up rules mid-game",
  "Most likely to get too loud at 2am",
  "Most likely to owe money by end of trip",
  "Most likely to be the last one standing",
  "Most likely to deny being drunk while hammered",
  "Most likely to get in someone's face",
  "Most likely to have the worst hangover tomorrow",
  "Most likely to fall asleep at the table",
  "Most likely to blame bad luck for their losses",
  "Most likely to think they're way funnier than they are",
  "Most likely to take a bet way too far",
  "Most likely to be completely useless tomorrow",
  "Most likely to lie about winning",
  "Most likely to get roasted all night",
  "Most likely to hit on the cart girl",
  "Most likely to blame the equipment",
  "Most likely to tell the same story 5 times",
  "Most likely to eat everyone's food",
  "Most likely to need to be carried to bed",
];

export const WOULD_YOU_RATHER_OPTIONS = [
  { a: "Chug a beer every hole tomorrow", b: "Take a shot for every bogey" },
  { a: "Play 36 holes brutally hungover", b: "Sit out and be everyone's caddy" },
  { a: "Lose $500 gambling tonight", b: "Shoot 120 tomorrow" },
  { a: "Never drink beer again", b: "Never play golf again" },
  { a: "Get chirped by the boys all week", b: "Have the worst score every round" },
  { a: "Wear the same boxers all trip", b: "Cold showers only all trip" },
  { a: "Play every round hungover", b: "Be DD the whole trip" },
  { a: "Shotgun a beer before every tee shot", b: "Do 10 pushups for every bogey" },
  { a: "Fight the biggest guy here", b: "Run a mile before every round" },
  { a: "Only eat gas station food all trip", b: "Sleep on the floor every night" },
  { a: "Lose every bet this trip", b: "Buy everyone's drinks one night" },
  { a: "Play with rental clubs all trip", b: "Play from the tips every round" },
];

export const IRL_GAME_PRESETS = [
  { name: "Left Right Center", emoji: "🎲", scoreType: "wins" },
  { name: "Poker", emoji: "🃏", scoreType: "chips" },
  { name: "Blackjack", emoji: "🂡", scoreType: "chips" },
  { name: "Beer Pong", emoji: "🏓", scoreType: "wins" },
  { name: "Flip Cup", emoji: "🍺", scoreType: "wins" },
  { name: "Cornhole", emoji: "🌽", scoreType: "points" },
  { name: "Darts", emoji: "🎯", scoreType: "points" },
  { name: "Pool", emoji: "🎱", scoreType: "wins" },
  { name: "Custom Game", emoji: "🎮", scoreType: "points" },
];
