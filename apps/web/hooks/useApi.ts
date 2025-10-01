// hooks/useApi.ts

import { useState, useEffect } from 'react';
import { apiService, StreamData, DonationData, SubscriptionData } from '../services/apiService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stream hooks
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [liveStreams, setLiveStreams] = useState<StreamData[]>([]);
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null);

  // Donation hooks
  const [donations, setDonations] = useState<DonationData[]>([]);

  // Subscription hooks
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);

  // Fetch all streams
  const fetchStreams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getStreams();
      setStreams(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch streams');
    } finally {
      setLoading(false);
    }
  };

  // Fetch live streams
  const fetchLiveStreams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getLiveStreams();
      setLiveStreams(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live streams');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single stream by ID
  const fetchStreamById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getStreamById(id);
      setCurrentStream(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stream');
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations for a stream
  const fetchDonations = async (streamId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getDonations(streamId);
      setDonations(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user subscriptions
  const fetchUserSubscriptions = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUserSubscriptions(userId);
      setSubscriptions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with live streams on mount
    fetchLiveStreams();
  }, []);

  return {
    // State
    loading,
    error,
    streams,
    liveStreams,
    currentStream,
    donations,
    subscriptions,

    // Functions
    fetchStreams,
    fetchLiveStreams,
    fetchStreamById,
    fetchDonations,
    fetchUserSubscriptions,
  };
};