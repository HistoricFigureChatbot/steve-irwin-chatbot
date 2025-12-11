/**
 * Unit Tests for ChatInput Component
 * Tests UT10 and UT11: Accessibility Features
 * 
 * UT10: Validate that UI components expose accessible names
 * UT11: Ensure core interface can be navigated using Tab key only
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '../components/ChatInput';

describe('UT10: Accessibility - ARIA Labels and Semantic HTML', () => {
  
  test('Should render input field with accessible type', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('Should have accessible placeholder text', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs, snakes, or conservation, mate!/i);
    expect(input).toBeInTheDocument();
  });

  test('Should have accessible button text', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const button = screen.getByRole('button', { name: /Send it mate!/i });
    expect(button).toBeInTheDocument();
  });

  test('Should indicate disabled state when typing', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={true} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Steve is thinking.../i);
    expect(input).toBeDisabled();
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('Should use semantic form element', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    const { container } = render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});

describe('UT11: Keyboard Navigation', () => {
  
  test('Should be focusable via keyboard', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    
    // Tab to focus input
    await user.tab();
    expect(input).toHaveFocus();
  });

  test('Should navigate from input to button via Tab', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    const button = screen.getByRole('button');
    
    // Tab to input
    await user.tab();
    expect(input).toHaveFocus();
    
    // Tab to button
    await user.tab();
    expect(button).toHaveFocus();
  });

  test('Should submit form on Enter key', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn((e) => e.preventDefault());
    
    render(
      <ChatInput 
        value="Hello" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    await user.click(input);
    await user.keyboard('{Enter}');
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should be typeable when focused', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    await user.click(input);
    await user.keyboard('Hello Steve');
    
    expect(mockOnChange).toHaveBeenCalled();
  });
});

describe('ChatInput - Component Behavior', () => {
  
  test('Should call onChange when user types', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Ask me about crocs/i);
    await user.type(input, 'Test');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('Should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn((e) => e.preventDefault());
    
    render(
      <ChatInput 
        value="Test message" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={false} 
      />
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should prevent interaction when isTyping is true', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    
    render(
      <ChatInput 
        value="" 
        onChange={mockOnChange} 
        onSubmit={mockOnSubmit} 
        isTyping={true} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Steve is thinking/i);
    const button = screen.getByRole('button');
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
