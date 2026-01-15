'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';

export default function InfoPage() {
  const { data, updateTripInfo } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(data.tripInfo);

  const handleSave = () => {
    updateTripInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Trip Info</h1>
        <button
          onClick={() => {
            if (isEditing) {
              setEditedInfo(data.tripInfo);
            }
            setIsEditing(!isEditing);
          }}
          className="text-[#FFD700] text-sm hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          {/* House Address */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[#888888] text-sm mb-1">House Address</div>
                <div className="text-white">{data.tripInfo.houseAddress}</div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(data.tripInfo.houseAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#2a2a2a] rounded-lg text-[#FFD700] text-sm hover:bg-[#3a3a3a]"
              >
                Maps
              </a>
            </div>
          </div>

          {/* Door Code */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#888888] text-sm mb-1">Door Code</div>
                <div className="text-white text-2xl font-mono">{data.tripInfo.doorCode}</div>
              </div>
              <button
                onClick={() => handleCopy(data.tripInfo.doorCode)}
                className="px-3 py-1.5 bg-[#2a2a2a] rounded-lg text-[#FFD700] text-sm hover:bg-[#3a3a3a]"
              >
                Copy
              </button>
            </div>
          </div>

          {/* WiFi Password */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#888888] text-sm mb-1">WiFi Password</div>
                <div className="text-white font-mono">{data.tripInfo.wifiPassword}</div>
              </div>
              <button
                onClick={() => handleCopy(data.tripInfo.wifiPassword)}
                className="px-3 py-1.5 bg-[#2a2a2a] rounded-lg text-[#FFD700] text-sm hover:bg-[#3a3a3a]"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card">
            <div className="text-[#888888] text-sm mb-1">Emergency Contact</div>
            <div className="text-white">{data.tripInfo.emergencyContact}</div>
          </div>

          {/* Nearest Hospital */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[#888888] text-sm mb-1">Nearest Hospital</div>
                <div className="text-white">{data.tripInfo.nearestHospital}</div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(data.tripInfo.nearestHospital)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#ef4444] rounded-lg text-white text-sm hover:bg-[#dc2626]"
              >
                Navigate
              </a>
            </div>
          </div>

          {/* Local Pizza */}
          <div className="card">
            <div className="text-[#888888] text-sm mb-1">Local Pizza/Food</div>
            <div className="text-white">{data.tripInfo.localPizza}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-2">House Address</label>
            <input
              type="text"
              value={editedInfo.houseAddress}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, houseAddress: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Door Code</label>
            <input
              type="text"
              value={editedInfo.doorCode}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, doorCode: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">WiFi Password</label>
            <input
              type="text"
              value={editedInfo.wifiPassword}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, wifiPassword: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Emergency Contact</label>
            <input
              type="text"
              value={editedInfo.emergencyContact}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, emergencyContact: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Nearest Hospital</label>
            <input
              type="text"
              value={editedInfo.nearestHospital}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, nearestHospital: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#888888] mb-2">Local Pizza/Food</label>
            <input
              type="text"
              value={editedInfo.localPizza}
              onChange={(e) =>
                setEditedInfo({ ...editedInfo, localPizza: e.target.value })
              }
              className="input"
            />
          </div>

          <button onClick={handleSave} className="btn-primary w-full mt-4">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
