"use client";

import { ReactNode } from "react";

interface DonationBarProps {
  donations: {
    id: string;
    from: string;
    amount: number;
    message?: string;
    timestamp: Date;
  }[];
}

export const DonationBar = ({ donations }: DonationBarProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Recent Donations</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {donations.length === 0 ? (
          <p className="text-gray-400 text-sm">No donations yet</p>
        ) : (
          donations.map((donation) => (
            <div key={donation.id} className="border-b border-gray-700 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <span className="text-green-400 font-medium">
                  {donation.from.slice(0, 6)}...{donation.from.slice(-4)}
                </span>
                <span className="text-yellow-400 font-bold">{donation.amount} SOL</span>
              </div>
              {donation.message && (
                <p className="text-gray-300 text-sm mt-1">{donation.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {new Date(donation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};