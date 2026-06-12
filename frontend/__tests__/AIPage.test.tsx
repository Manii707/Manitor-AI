import React from 'react';
import { render, screen } from '@testing-library/react';
import AIPage from '../src/app/ai/page';

// Mock WebSocket
class MockWebSocket {
  onmessage: any;
  onerror: any;
  send = jest.fn();
  close = jest.fn();
  constructor(url: string) {}
}

global.WebSocket = MockWebSocket as any;

describe('AIPage Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
  });

  it('renders the AI header and initial greeting', () => {
    render(<AIPage />);
    expect(screen.getByText('MONI AI')).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am MONI/i)).toBeInTheDocument();
  });

  it('renders the chat input box', () => {
    render(<AIPage />);
    expect(screen.getByPlaceholderText('Ask MONI anything about your life...')).toBeInTheDocument();
  });
});
