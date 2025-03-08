import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantityControls from '../QuantityControls';

describe('QuantityControls', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial quantity', () => {
    render(
      <QuantityControls
        quantity={1}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(screen.getByTitle('حذف')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    render(
      <QuantityControls
        quantity={1}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('calls onUpdate when quantity is changed', async () => {
    render(
      <QuantityControls
        quantity={1}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '5');
    
    // Wait for debounce
    await new Promise((r) => setTimeout(r, 1000));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(5);
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <QuantityControls
        quantity={1}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    await userEvent.click(screen.getByTitle('حذف'));
    expect(mockOnDelete).toHaveBeenCalled();
  });
}); 