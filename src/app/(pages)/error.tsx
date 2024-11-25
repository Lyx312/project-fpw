'use client'

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom color="error">
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        We encountered an unexpected error. Please try again or return to the home page.
      </Typography>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}