import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from './Timer';

// filepath: c:\Users\aleja\OneDrive - Universidad de Oviedo\ASW\wichat_es1c\webapp\src\components\Times.test.js


describe('Timer Component', () => {
    test('renders Timer component with initial time', () => {
        render(<Timer initialTime={60} />);
        const timerElement = screen.getByText(/60/i);
        expect(timerElement).toBeInTheDocument();
    });

    test('updates time correctly', () => {
        jest.useFakeTimers();
        render(<Timer initialTime={60} />);
        jest.advanceTimersByTime(1000);
        const timerElement = screen.getByText(/59/i);
        expect(timerElement).toBeInTheDocument();
        jest.useRealTimers();
    });

    test('stops at zero', () => {
        jest.useFakeTimers();
        render(<Timer initialTime={1} />);
        jest.advanceTimersByTime(2000);
        const timerElement = screen.getByText(/0/i);
        expect(timerElement).toBeInTheDocument();
        jest.useRealTimers();
    });

    test('calls onComplete callback when time reaches zero', () => {
        const onCompleteMock = jest.fn();
        jest.useFakeTimers();
        render(<Timer initialTime={1} onComplete={onCompleteMock} />);
        jest.advanceTimersByTime(2000);
        expect(onCompleteMock).toHaveBeenCalledTimes(1);
        jest.useRealTimers();
    });
});