import { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';

const Timer = ({ onTimeOut, duration = 60 }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [hasTimedOut, setHasTimedOut] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (!hasTimedOut) {
                setHasTimedOut(true);
                onTimeOut();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, hasTimedOut, onTimeOut]);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <CircularProgress 
                variant="determinate" 
                value={(timeLeft / duration) * 100} 
                size={100} 
                thickness={6} 
                sx={{ color: timeLeft <= 10 ? 'red' : 'primary.main' }}
            />
            <Typography 
                variant="h5" 
                sx={{
                    position: 'absolute',
                    fontWeight: 'bold',
                    color: timeLeft <= 10 ? 'red' : 'black'
                }}
            >
                {timeLeft}s
            </Typography>
        </Box>
    );
};

export default Timer;