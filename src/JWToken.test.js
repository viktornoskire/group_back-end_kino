import { describe, expect, jest, it } from '@jest/globals';
import jsonwebtoken from 'jsonwebtoken';
import { reviewAdapter } from './sendReviews.js'; // Replace with actual file path

describe('reviewAdapter', () => {
  let mockRequest;
  let mockResponse;
  const KEY = 'averylongpasswordthattheonlyonewhoknowswhatitisisthiscomputercodeblock';

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    }
  })
  describe('loadLogin', () => {
    it('should return a token for valid credentials', () => {
      const username = 'viktor';
      const password = 'wilma';
      const credentials = `${username}:${password}`;
      const b64credentials = Buffer.from(credentials).toString('base64');

      mockRequest.headers.authorization = 'Basic ' + b64credentials;

      reviewAdapter.loadLogin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          token: expect.any(String),
        })
      );
    });

    it('should return 401 for invalid credentials', () => {
      const wrongUser = 'incorrect';
      const wrongPassword = 'notCorrect';
      const credentials = `${wrongUser}:${wrongPassword}`;
      const b64credentials = Buffer.from(credentials).toString('base64');

      mockRequest.headers.authorization = 'Basic ' + b64credentials;

      reviewAdapter.loadLogin(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.end).toHaveBeenCalledWith();
    });
  });
  describe('sendReviewAccess', () => {
    it('should allow access with a valid token', () => {
      const token = jsonwebtoken.sign({ username: 'viktor', password: 'wilma' }, KEY);

      mockRequest.headers.authorization = 'Bearer ' + token;
      reviewAdapter.sendReviewAccess(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ ok: true });
    });

    it('should return 401 for an invalid token', () => {
      mockRequest.headers.authorization = 'Bearer invalidToken';
      reviewAdapter.sendReviewAccess(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'not allowed', ok: false });
    });

    it('should return 401 if no token is provided', () => {
      reviewAdapter.sendReviewAccess(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'not allowed', ok: false });
    });
  });
});
