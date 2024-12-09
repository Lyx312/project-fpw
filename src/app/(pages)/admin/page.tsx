'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItemText, CircularProgress, ListItem, ListItemButton } from '@mui/material';
import Link from 'next/link';

interface Application {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/users/applications');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">No applications found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Pending Applications
        </Typography>
        <List>
          {applications.map((app) => (
            <Link key={app.email} href={`/admin/application/${app.email}`} passHref>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary={`${app.first_name} ${app.last_name}`} secondary={app.email} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ApplicationsPage;
