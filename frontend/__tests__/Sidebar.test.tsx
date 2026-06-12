import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../src/components/Sidebar';

describe('Sidebar Component', () => {
  it('renders all primary navigation links', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('MONI AI')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('opens profile popover on click and shows logout button', () => {
    render(<Sidebar />);
    
    // The popover shouldn't be visible initially
    expect(screen.queryByText('Log Out Terminal')).not.toBeInTheDocument();
    
    // Click the profile trigger
    const profileTrigger = screen.getByText('Admin').parentElement?.parentElement;
    if (profileTrigger) {
      fireEvent.click(profileTrigger);
    }
    
    // Now it should be visible
    expect(screen.getByText('Log Out Terminal')).toBeInTheDocument();
    expect(screen.getByText('System Admin')).toBeInTheDocument();
  });
});
