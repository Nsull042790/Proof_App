'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/components/providers/DataProvider';
import { EMPTY_STATES } from '@/lib/constants';
import { getPlayerDisplayName, formatTimestamp, formatTime } from '@/lib/utils';

type TabType = 'chat' | 'quotes';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const showQuoteModal = searchParams.get('action') === 'quote';

  const { data, getCurrentPlayer, addMessage, addQuote, reactToMessage, reactToQuote, getPlayerById } = useData();
  const currentPlayer = getCurrentPlayer();

  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messageInput, setMessageInput] = useState('');
  const [isAddingQuote, setIsAddingQuote] = useState(showQuoteModal);
  const [quoteContent, setQuoteContent] = useState('');
  const [quoteSaidBy, setQuoteSaidBy] = useState('');
  const [quoteContext, setQuoteContext] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentPlayer) return;
    addMessage({
      playerId: currentPlayer.id,
      content: messageInput.trim(),
    });
    setMessageInput('');
  };

  const handleAddQuote = () => {
    if (!quoteContent.trim() || !quoteSaidBy) return;
    addQuote({
      content: quoteContent.trim(),
      saidBy: quoteSaidBy,
      context: quoteContext.trim(),
    });
    setQuoteContent('');
    setQuoteSaidBy('');
    setQuoteContext('');
    setIsAddingQuote(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Tab Header */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'chat'
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888]'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'quotes'
                ? 'bg-[#FFD700] text-black'
                : 'bg-[#1a1a1a] text-[#888888]'
            }`}
          >
            📖 Quote Book
          </button>
        </div>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 space-y-3">
            {data.messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-[#888888] italic">{EMPTY_STATES.messages}</p>
              </div>
            ) : (
              data.messages.map((message) => {
                const sender = getPlayerById(message.playerId);
                const isMe = sender?.id === currentPlayer?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        isMe
                          ? 'bg-[#FFD700] text-black rounded-2xl rounded-br-sm'
                          : 'bg-[#1a1a1a] text-white rounded-2xl rounded-bl-sm'
                      } p-3`}
                    >
                      {!isMe && (
                        <div className="text-xs font-semibold mb-1 text-[#FFD700]">
                          {sender ? getPlayerDisplayName(sender) : 'Unknown'}
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <div className={`text-[10px] mt-1 ${isMe ? 'text-black/60' : 'text-[#666666]'}`}>
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#2a2a2a]">
            {currentPlayer ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="input flex-1"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="btn-primary px-6"
                >
                  Send
                </button>
              </div>
            ) : (
              <p className="text-center text-[#888888] text-sm">
                Select a player in Setup to chat
              </p>
            )}
          </div>
        </>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddingQuote(true)}
              className="btn-primary text-sm py-2 px-4"
            >
              + Add Quote
            </button>
          </div>

          {data.quotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📖</div>
              <p className="text-[#888888] italic">{EMPTY_STATES.quotes}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.quotes.map((quote) => {
                const speaker = getPlayerById(quote.saidBy);

                return (
                  <div key={quote.id} className="card">
                    <div className="text-xl text-white mb-2">"{quote.content}"</div>
                    <div className="text-[#FFD700] text-sm mb-1">
                      — {speaker ? getPlayerDisplayName(speaker) : 'Unknown'}
                    </div>
                    {quote.context && (
                      <div className="text-[#666666] text-xs italic mb-3">
                        Context: {quote.context}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {[
                          { key: 'fire', emoji: '🔥' },
                          { key: 'dead', emoji: '💀' },
                          { key: 'laugh', emoji: '😂' },
                          { key: 'cap', emoji: '🧢' },
                        ].map((reaction) => (
                          <button
                            key={reaction.key}
                            onClick={() =>
                              reactToQuote(quote.id, reaction.key as keyof typeof quote.reactions)
                            }
                            className="flex items-center gap-1 px-2 py-1 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a] transition-colors"
                          >
                            <span className="text-sm">{reaction.emoji}</span>
                            <span className="text-xs text-white">
                              {quote.reactions[reaction.key as keyof typeof quote.reactions]}
                            </span>
                          </button>
                        ))}
                      </div>
                      <span className="text-[#666666] text-xs">
                        {formatTimestamp(quote.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Quote Modal */}
      {isAddingQuote && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setIsAddingQuote(false)}
          />
          <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
            <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up">
              <h2 className="text-xl font-bold text-white mb-4">Add to Quote Book</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-2">The Quote</label>
                  <textarea
                    value={quoteContent}
                    onChange={(e) => setQuoteContent(e.target.value)}
                    className="input min-h-[80px] resize-none"
                    placeholder="What did they say?"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2">Who Said It</label>
                  <select
                    value={quoteSaidBy}
                    onChange={(e) => setQuoteSaidBy(e.target.value)}
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
                  <label className="block text-sm text-[#888888] mb-2">Context (optional)</label>
                  <input
                    type="text"
                    value={quoteContext}
                    onChange={(e) => setQuoteContext(e.target.value)}
                    className="input"
                    placeholder="What was happening?"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsAddingQuote(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuote}
                    disabled={!quoteContent.trim() || !quoteSaidBy}
                    className="btn-primary flex-1"
                  >
                    Add Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
