import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleWidget } from '../collapsible-widget';

describe('CollapsibleWidget', () => {
  it('renders with title and children', () => {
    render(
      <CollapsibleWidget title="Test Widget">
        <div>Widget Content</div>
      </CollapsibleWidget>
    );
    
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
    expect(screen.getByText('Widget Content')).toBeInTheDocument();
  });

  it('starts expanded by default', () => {
    render(
      <CollapsibleWidget title="Test Widget">
        <div>Widget Content</div>
      </CollapsibleWidget>
    );
    
    expect(screen.getByText('Widget Content')).toBeVisible();
    expect(screen.getByTestId('collapse-button')).toBeInTheDocument();
  });

  it('starts collapsed when defaultCollapsed is true', () => {
    render(
      <CollapsibleWidget title="Test Widget" defaultCollapsed={true}>
        <div>Widget Content</div>
      </CollapsibleWidget>
    );
    
    expect(screen.queryByText('Widget Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('expand-button')).toBeInTheDocument();
  });

  it('toggles between collapsed and expanded when clicked', () => {
    render(
      <CollapsibleWidget title="Test Widget">
        <div>Widget Content</div>
      </CollapsibleWidget>
    );
    
    // Initially expanded
    expect(screen.getByText('Widget Content')).toBeVisible();
    
    // Collapse it
    fireEvent.click(screen.getByTestId('collapse-button'));
    expect(screen.queryByText('Widget Content')).not.toBeInTheDocument();
    
    // Expand it again
    fireEvent.click(screen.getByTestId('expand-button'));
    expect(screen.getByText('Widget Content')).toBeVisible();
  });

  it('calls onExpandChanged callback when toggled', () => {
    const onExpandChangedMock = jest.fn();
    
    render(
      <CollapsibleWidget 
        title="Test Widget" 
        onExpandChanged={onExpandChangedMock}
      >
        <div>Widget Content</div>
      </CollapsibleWidget>
    );
    
    // Initially expanded (so onExpandChanged hasn't been called yet)
    expect(onExpandChangedMock).not.toHaveBeenCalled();
    
    // Collapse it - should call onExpandChanged(false)
    fireEvent.click(screen.getByTestId('collapse-button'));
    expect(onExpandChangedMock).toHaveBeenCalledWith(false);
    
    // Expand it - should call onExpandChanged(true)
    fireEvent.click(screen.getByTestId('expand-button'));
    expect(onExpandChangedMock).toHaveBeenCalledWith(true);
    expect(onExpandChangedMock).toHaveBeenCalledTimes(2);
  });
}); 