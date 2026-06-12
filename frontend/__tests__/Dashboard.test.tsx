import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../src/app/page';

// Mock matchMedia for recharts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      productivity_score: "85%",
      tasks_completed: "17/20",
      monthly_savings: "$4,500",
      upcoming_events: "3 Today",
      remaining_tasks: [
        { title: "Review automated tests", category: "Dev", due: "Dec 31" }
      ],
      chart_data: [20, 30, 40]
    }),
  })
) as jest.Mock;

describe('Dashboard Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
  });

  it('renders the dashboard header', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('MONI Insights')).toBeInTheDocument();
  });

  it('fetches and displays productivity score', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('displays remaining tasks from API', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Review automated tests')).toBeInTheDocument();
    });
  });
});
