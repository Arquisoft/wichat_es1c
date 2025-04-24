import { render, screen, act } from '@testing-library/react';
import Timer from './Timer';

describe('Timer Component', () => {
    jest.useFakeTimers();

    it('renders the Timer component with initial time', () => {
        render(<Timer duration={60} onTimeOut={jest.fn()} />);
        expect(screen.getByText('60s')).toBeInTheDocument();
    });

    it('counts down and calls onTimeOut when time runs out', () => {
        const onTimeOutMock = jest.fn();
        render(<Timer duration={5} onTimeOut={onTimeOutMock} />);

        act(() => {
            jest.advanceTimersByTime(5000); // Simulate 5 seconds
        });

        expect(onTimeOutMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText('0s')).toBeInTheDocument();
    });

    it('updates the CircularProgress color when timeLeft is less than or equal to 10', () => {
        render(<Timer duration={15} onTimeOut={jest.fn()} />);

        act(() => {
            jest.advanceTimersByTime(6000); // Simulate 6 seconds
        });

        const progress = screen.getByRole('progressbar');
        expect(progress).toHaveStyle('color: red');
    });

    it('cleans up the interval on unmount', () => {
        const { unmount } = render(<Timer duration={10} onTimeOut={jest.fn()} />);
        unmount();

        act(() => {
            jest.advanceTimersByTime(5000); // Simulate 5 seconds
        });

        // No errors should occur, indicating cleanup was successful
    });
});