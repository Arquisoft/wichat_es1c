import { render, screen } from '@testing-library/react';
import Timer from './Timer';

test('does not call onComplete callback before time reaches zero', () => {
    const onCompleteMock = jest.fn();
    jest.useFakeTimers();
    render(<Timer initialTime={5} onComplete={onCompleteMock} />);
    jest.advanceTimersByTime(4000);
    expect(onCompleteMock).not.toHaveBeenCalled();
    jest.useRealTimers();
});