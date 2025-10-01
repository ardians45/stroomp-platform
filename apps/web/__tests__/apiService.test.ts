// __tests__/apiService.test.ts

import { apiService } from '../services/apiService';

// Mock fetch globally
global.fetch = jest.fn();

describe('apiService', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockClear();
  });

  describe('getStreams', () => {
    it('should fetch streams successfully', async () => {
      const mockStreams = [
        {
          id: '1',
          title: 'Test Stream',
          description: 'Test Description',
          category: 'GAMING',
          status: 'LIVE',
          streamer: {
            id: 's1',
            walletAddress: 'testWallet123',
            username: 'testStreamer',
            profileImageUrl: ''
          },
          viewers: 100,
          startTime: new Date().toISOString()
        }
      ];

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockStreams
        })
      } as Response);

      const result = await apiService.getStreams();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStreams);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/streams',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Failed to fetch streams'
        })
      } as Response);

      await expect(apiService.getStreams()).rejects.toThrow('Failed to fetch streams');
    });
  });

  describe('getStreamById', () => {
    it('should fetch a stream by ID successfully', async () => {
      const mockStream = {
        id: '1',
        title: 'Test Stream',
        description: 'Test Description',
        category: 'GAMING',
        status: 'LIVE',
        streamer: {
          id: 's1',
          walletAddress: 'testWallet123',
          username: 'testStreamer',
          profileImageUrl: ''
        },
        viewers: 100,
        startTime: new Date().toISOString()
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockStream
        })
      } as Response);

      const result = await apiService.getStreamById('1');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStream);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/streams/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  describe('createDonation', () => {
    it('should create a donation successfully', async () => {
      const donationData = {
        from: 'wallet1',
        to: 'wallet2',
        amount: 1.5,
        message: 'Great stream!',
        txSignature: 'testTxSignature123'
      };

      const expectedResponse = {
        id: 'donation1',
        ...donationData,
        timestamp: new Date().toISOString()
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: expectedResponse
        })
      } as Response);

      const result = await apiService.createDonation(donationData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/donations',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(donationData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });
});