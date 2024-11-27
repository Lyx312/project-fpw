'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  List,
  ListItem,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Country {
  country_id: string;
  country_name: string;
}

const CountryManager: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch countries from the database
  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/country'); // GET request
      if (!response.ok) {
        throw new Error(`Error fetching countries: ${response.status}`);
      }
      const data = await response.json();
      setCountries(data.data || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Insert countries into the database
  const insertCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/country', {
        method: 'POST', // POST request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to insert countries');
      }

      const data = await response.json();
      console.log(data.message);

      // Refresh the country list after insertion
      fetchCountries();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to insert countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Country Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={insertCountries}
        disabled={loading}
        sx={{ mb: 2 }}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Processing...' : 'Fetch and Insert from API'}
      </Button>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Countries in Database
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mt: 2 }} />
      ) : countries.length > 0 ? (
        <List>
          {countries.map((country) => (
            <ListItem key={country.country_id}>
              {country.country_name} ({country.country_id})
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No countries found.
        </Typography>
      )}
    </Box>
  );
};

export default CountryManager;
