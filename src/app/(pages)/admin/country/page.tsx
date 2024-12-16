/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TextField,
} from '@mui/material';

interface Country {
  country_id: string;
  country_name: string;
}

const CountryManager: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    nameFilter: '',
    limit: 30,
    minPopulation: 0,
    maxPopulation: 0,
    minArea: 0,
    maxArea: 0,
  });

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/country');
      if (!response.ok) throw new Error(`Error fetching countries: ${response.status}`);

      const data = await response.json();
      setCountries(data.data || []);
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const insertCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { nameFilter, limit, minPopulation, maxPopulation, minArea, maxArea } = filters;
      const response = await fetch(
        `/api/country?name=${nameFilter}&limit=${limit}&min_population=${minPopulation}&max_population=${maxPopulation}&min_area=${minArea}&max_area=${maxArea}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to insert countries');
      }

      const data = await response.json();
      console.log(data.message);
      fetchCountries();
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to insert countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

      {/* Filters Section */}
      <Box
        sx={{
          mb: 2,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        {[
          { label: 'Country Name', key: 'nameFilter', type: 'text' },
          { label: 'Limit', key: 'limit', type: 'number' },
          { label: 'Min Population', key: 'minPopulation', type: 'number' },
          { label: 'Max Population', key: 'maxPopulation', type: 'number' },
          { label: 'Min Area (sq km)', key: 'minArea', type: 'number' },
          { label: 'Max Area (sq km)', key: 'maxArea', type: 'number' },
        ].map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            type={field.type}
            value={filters[field.key as keyof typeof filters]}
            onChange={(e) => handleFilterChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            variant="outlined"
          />
        ))}
      </Box>

      {/* Action Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={insertCountries}
        disabled={loading}
        sx={{ mb: 2 }}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Processing...' : 'Fetch and Insert from API'}
      </Button>

      <Divider sx={{ mb: 2 }} />

      {/* Country List */}
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
