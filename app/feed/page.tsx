'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/components/providers/DataProvider';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { PROOF_TYPES, CAPTION_TEMPLATES, EMPTY_STATES } from '@/lib/constants';
import { getPlayerDisplayName, formatTimestamp, compressImage } from '@/lib/utils';
import { Photo } from '@/lib/types';

export default function FeedPage() {
  const searchParams = useSearchParams();
  const showUpload = searchParams.get('action') === 'upload';

  const { data, currentPlayerId, addPhoto, reactToPhoto, deletePhoto, getPlayerById, uploadPhoto, isOnline, refreshData } = useData();
  const currentPlayer = currentPlayerId ? data.players.find(p => p.id === currentPlayerId) || null : null;
  const { showToast } = useToast();
  const confirm = useConfirm();

  const [isUploading, setIsUploading] = useState(showUpload);
  const [uploadStep, setUploadStep] = useState(1);
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [proofType, setProofType] = useState<Photo['proofType']>('life');
  const [caption, setCaption] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [taggedPlayers, setTaggedPlayers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSelectedFile(file);
      const compressed = await compressImage(file);
      setImageData(compressed);
      setUploadStep(2);
    } catch (error) {
      console.error('Error processing image:', error);
      showToast('Failed to process image', 'error');
    }
  };

  const handleUpload = async () => {
    if (!currentPlayer || (!imageData && !selectedFile)) return;

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageData;

      if (isOnline && selectedFile) {
        const uploadedUrl = await uploadPhoto(selectedFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      if (!finalImageUrl) {
        showToast('Failed to upload image', 'error');
        return;
      }

      addPhoto({
        uploadedBy: currentPlayer.id,
        imageData: finalImageUrl,
        caption: caption === 'custom' ? customCaption : caption,
        proofType,
        taggedPlayers,
      });

      showToast('Photo posted!', 'success');

      // Reset
      setIsUploading(false);
      setUploadStep(1);
      setImageData(null);
      setSelectedFile(null);
      setProofType('life');
      setCaption('');
      setCustomCaption('');
      setTaggedPlayers([]);
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('Failed to post photo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    const confirmed = await confirm({
      title: 'Delete Photo',
      message: 'Are you sure you want to delete this photo? This cannot be undone.',
      confirmText: 'Delete',
      destructive: true,
    });

    if (!confirmed) return;

    setIsDeleting(photoId);
    const success = await deletePhoto(photoId);
    setIsDeleting(null);

    if (success) {
      showToast('Photo deleted', 'success');
    } else {
      showToast('Failed to delete photo', 'error');
    }
  };

  const handleReaction = (photoId: string, reaction: keyof Photo['reactions']) => {
    reactToPhoto(photoId, reaction);
  };

  return (
    <PullToRefresh onRefresh={refreshData}>
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Feed</h1>
          <button
            onClick={() => setIsUploading(true)}
            className="btn-primary text-sm py-2 px-4"
          >
            + Post
          </button>
        </div>

        {/* Photo Feed */}
        {data.photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-[#888888] italic">{EMPTY_STATES.photos}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.photos.map((photo) => {
              const uploader = getPlayerById(photo.uploadedBy);
              const proofTypeInfo = PROOF_TYPES.find((p) => p.value === photo.proofType);
              const isOwner = currentPlayer?.id === photo.uploadedBy;

              return (
                <div key={photo.id} className={`card p-0 overflow-hidden ${isDeleting === photo.id ? 'opacity-50' : ''}`}>
                  {/* Header */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm font-bold text-[#FFD700]">
                        {uploader?.name.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {uploader ? getPlayerDisplayName(uploader) : 'Unknown'}
                        </div>
                        <div className="text-[#666666] text-xs">
                          {formatTimestamp(photo.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#2a2a2a] px-2 py-1 rounded-full text-[#888888]">
                        {proofTypeInfo?.emoji} {proofTypeInfo?.label}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(photo.id)}
                          disabled={isDeleting === photo.id}
                          className="text-[#666666] hover:text-[#ef4444] transition-colors p-1"
                        >
                          {isDeleting === photo.id ? (
                            <LoadingSpinner size="sm" color="#ef4444" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square bg-[#0a0a0a]">
                    <img
                      src={photo.imageData}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption & Tags */}
                  <div className="p-3">
                    {photo.caption && (
                      <p className="text-white text-sm mb-2">{photo.caption}</p>
                    )}
                    {photo.taggedPlayers.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {photo.taggedPlayers.map((playerId) => {
                          const player = getPlayerById(playerId);
                          return (
                            <span
                              key={playerId}
                              className="text-xs bg-[#2a2a2a] px-2 py-0.5 rounded-full text-[#FFD700]"
                            >
                              @{player ? getPlayerDisplayName(player) : 'Unknown'}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="flex gap-2">
                      {[
                        { key: 'fire', emoji: '🔥' },
                        { key: 'dead', emoji: '💀' },
                        { key: 'laugh', emoji: '😂' },
                        { key: 'cap', emoji: '🧢' },
                      ].map((reaction) => (
                        <button
                          key={reaction.key}
                          onClick={() => handleReaction(photo.id, reaction.key as keyof Photo['reactions'])}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a] transition-colors"
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-xs text-white">
                            {photo.reactions[reaction.key as keyof Photo['reactions']]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Modal */}
        {isUploading && (
          <>
            <div
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => {
                if (!isSubmitting) {
                  setIsUploading(false);
                  setUploadStep(1);
                  setImageData(null);
                }
              }}
            />
            <div className="fixed inset-x-4 bottom-0 top-auto z-50 max-w-lg mx-auto">
              <div className="bg-[#1a1a1a] rounded-t-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {uploadStep === 1 && 'Select Photo'}
                    {uploadStep === 2 && 'Proof Type'}
                    {uploadStep === 3 && 'Add Details'}
                  </h2>
                  <button
                    onClick={() => {
                      if (!isSubmitting) {
                        setIsUploading(false);
                        setUploadStep(1);
                        setImageData(null);
                      }
                    }}
                    className="text-[#888888] hover:text-white"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>

                {/* Step 1: Select Image */}
                {uploadStep === 1 && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video bg-[#2a2a2a] rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-[#3a3a3a] transition-colors"
                    >
                      <span className="text-4xl">📸</span>
                      <span className="text-white font-medium">Tap to select photo</span>
                      <span className="text-[#666666] text-sm">JPG, PNG supported</span>
                    </button>
                  </div>
                )}

                {/* Step 2: Proof Type */}
                {uploadStep === 2 && imageData && (
                  <div>
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img src={imageData} alt="Preview" className="w-full aspect-video object-cover" />
                    </div>
                    <div className="space-y-2">
                      {PROOF_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => {
                            setProofType(type.value as Photo['proofType']);
                            setUploadStep(3);
                          }}
                          className={`w-full p-4 rounded-lg flex items-center gap-3 transition-all ${
                            proofType === type.value
                              ? 'bg-[#FFD700] text-black'
                              : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                          }`}
                        >
                          <span className="text-2xl">{type.emoji}</span>
                          <span className="font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Caption & Tags */}
                {uploadStep === 3 && imageData && (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden">
                      <img src={imageData} alt="Preview" className="w-full aspect-video object-cover" />
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-sm text-[#888888] mb-2">Caption</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {CAPTION_TEMPLATES.map((template) => (
                          <button
                            key={template}
                            onClick={() => setCaption(template)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              caption === template
                                ? 'bg-[#FFD700] text-black'
                                : 'bg-[#2a2a2a] text-white'
                            }`}
                          >
                            {template}
                          </button>
                        ))}
                        <button
                          onClick={() => setCaption('custom')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            caption === 'custom'
                              ? 'bg-[#FFD700] text-black'
                              : 'bg-[#2a2a2a] text-white'
                          }`}
                        >
                          Custom...
                        </button>
                      </div>
                      {caption === 'custom' && (
                        <input
                          type="text"
                          value={customCaption}
                          onChange={(e) => setCustomCaption(e.target.value)}
                          className="input"
                          placeholder="Write your own caption..."
                        />
                      )}
                    </div>

                    {/* Tag Players */}
                    <div>
                      <label className="block text-sm text-[#888888] mb-2">Tag Players</label>
                      <div className="flex flex-wrap gap-2">
                        {data.players.map((player) => (
                          <button
                            key={player.id}
                            onClick={() => {
                              setTaggedPlayers((prev) =>
                                prev.includes(player.id)
                                  ? prev.filter((id) => id !== player.id)
                                  : [...prev, player.id]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              taggedPlayers.includes(player.id)
                                ? 'bg-[#FFD700] text-black'
                                : 'bg-[#2a2a2a] text-white'
                            }`}
                          >
                            {getPlayerDisplayName(player)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleUpload}
                      disabled={isSubmitting}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" color="#000" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        'Post Proof'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PullToRefresh>
  );
}
