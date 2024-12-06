'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, CircularProgress, Button, Stack } from '@mui/material';

interface ApplicationDetails {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_id: string;
  phone: string;
  role: string;
  cv_path: string;
  gender: string;
  balance: number;
  is_approved: boolean;
}

const ApplicationDetailsPage = ({ params }: { params: { id: string } }) => {
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/users/applications/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch application');
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application details:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id, router]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/users/applications/${params.id}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to approve application');
      alert('Application approved successfully');
      router.push('/admin');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/applications/${params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete application');
      alert('Application deleted successfully');
      router.push('/admin');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">Application not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Application Details
        </Typography>
        <Typography variant="h6">Name:</Typography>
        <Typography>{`${application.first_name} ${application.last_name}`}</Typography>
        <Typography variant="h6" mt={2}>
          Email:
        </Typography>
        <Typography>{application.email}</Typography>
        <Typography variant="h6" mt={2}>
          Phone:
        </Typography>
        <Typography>{application.phone}</Typography>
        <Typography variant="h6" mt={2}>
          Country ID:
        </Typography>
        <Typography>{application.country_id}</Typography>
        <Typography variant="h6" mt={2}>
          Role:
        </Typography>
        <Typography>{application.role}</Typography>
        <Typography variant="h6" mt={2}>
          CV Path:
        </Typography>
        <Typography>{application.cv_path || 'Not provided'}</Typography>
        <Typography variant="h6" mt={2}>
          Gender:
        </Typography>
        <Typography>{application.gender || 'Not specified'}</Typography>

        <Stack direction="row" spacing={2} mt={4}>
          <Button variant="contained" color="success" onClick={handleApprove}>
            Approve
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Reject
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ApplicationDetailsPage;
