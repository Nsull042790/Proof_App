'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { ROUNDS } from '@/lib/constants';
import { getPlayerDisplayName } from '@/lib/utils';

const DAYS = ['thursday', 'friday', 'saturday', 'sunday', 'monday'] as const;

const DAY_HEADERS = {
  thursday: { title: 'Thursday — May 22', subtitle: 'Check-in & Chaos' },
  friday: { title: 'Friday — May 23', subtitle: '36 Holes of Bad Decisions' },
  saturday: { title: 'Saturday — May 24', subtitle: 'Recovery & Redemption' },
  sunday: { title: 'Sunday — May 25', subtitle: 'Championship Sunday' },
  monday: { title: 'Monday — May 26', subtitle: 'The End' },
};

export default function SchedulePage() {
  const { data, getPlayerById } = useData();
  const [expandedDay, setExpandedDay] = useState<string | null>('friday');

  const getFoursomesForRound = (roundNumber: number) => {
    const key = `round${roundNumber}` as keyof typeof data.foursomes;
    return data.foursomes[key] || [];
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Schedule</h1>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const isExpanded = expandedDay === day;
          const header = DAY_HEADERS[day];
          const notes = data.itineraryNotes[day];

          // Find rounds for this day
          const dayRounds = ROUNDS.filter((r) =>
            r.day.toLowerCase().includes(day.slice(0, 3))
          );

          return (
            <div key={day} className="card p-0 overflow-hidden">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-white font-semibold">{header.title}</div>
                  <div className="text-[#FFD700] text-sm">{header.subtitle}</div>
                </div>
                <svg
                  className={`w-5 h-5 text-[#888888] transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4 animate-fade-in">
                  {/* Schedule Items */}
                  <div className="space-y-2 mb-4">
                    {notes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full flex-shrink-0" />
                        <span className="text-[#888888]">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Foursomes for rounds */}
                  {dayRounds.map((round) => {
                    const foursomes = getFoursomesForRound(round.number);

                    return (
                      <div key={round.number} className="mt-4 pt-4 border-t border-[#2a2a2a]">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-white font-medium">{round.course}</div>
                            <div className="text-[#666666] text-xs">{round.day}</div>
                          </div>
                          <span className="text-xs bg-[#1a472a] text-[#22c55e] px-2 py-1 rounded-full">
                            {round.name}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {foursomes.map((group, groupIdx) => (
                            <div
                              key={groupIdx}
                              className="bg-[#2a2a2a] rounded-lg p-3"
                            >
                              <div className="text-xs text-[#666666] mb-2">
                                Group {groupIdx + 1}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {group.map((playerId) => {
                                  const player = getPlayerById(playerId);
                                  return (
                                    <span
                                      key={playerId}
                                      className="px-2 py-1 bg-[#1a1a1a] rounded text-sm text-white"
                                    >
                                      {player ? getPlayerDisplayName(player) : 'TBD'}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
