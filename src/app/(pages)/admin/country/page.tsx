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
  Grid
} from '@mui/material';

const colors = {
  primary: "#001F3F",
  secondary: "#3A6D8C",
  accent: "#6A9AB0",
  text: "#EAD8B1",
  background: "#f5f5f5",
};

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
    <Box p={3} sx={{ backgroundColor: colors.primary, minHeight: '100vh', color: colors.text }}>
      <Typography variant="h4" gutterBottom sx={{ color: colors.text, textAlign: 'center' }}>
        Country Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: colors.accent, color: colors.text }}>
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
          backgroundColor: colors.accent,
          padding: 2,
          borderRadius: '5px'
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
            sx={{ borderRadius: '5px' }}
          />
        ))}
      </Box>

      {/* Action Button */}
      <Button
        variant="contained"
        onClick={insertCountries}
        disabled={loading}
        sx={{
          mb: 2,
          backgroundColor: colors.accent,
          color: "white",
          '&:hover': { backgroundColor: colors.secondary },
        }}
        startIcon={loading ? <CircularProgress size={20} sx={{ color: colors.text }} /> : null}
      >
        {loading ? 'Processing...' : 'Fetch and Insert from API'}
      </Button>

      <Divider sx={{ mb: 2, borderColor: colors.accent }} />

      {/* Country List */}
      <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
        Countries in Database
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mt: 2, color: colors.secondary }} />
      ) : countries.length > 0 ? (
        <List sx={{ backgroundColor: "white", borderRadius: '8px' }}>
          <Grid container spacing={2}>
            {countries.map((country) => (
              <Grid item xs={4} key={country.country_id}>
                <ListItem sx={{ color: "black", display: 'flex', justifyContent: 'center' }}>
                  {country.country_name} ({country.country_id})
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </List>
      ) : (
        <Typography variant="body1" sx={{ color: colors.text }}>
          No countries found.
        </Typography>
      )}
    </Box>
  );
};

export default CountryManager;
