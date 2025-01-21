'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  Stack, 
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';

const colorPalette = {
  darkBlue: "#001F3F",
  mediumBlue: "#3A6D8C",
  lightBlue: "#6A9AB0",
  beige: "#EAD8B1",
  gradientButton: "linear-gradient(45deg, #3A6D8C, #6A9AB0)",
};

interface Category {
  _id: string;
  category_id: number;
  category_name: string;
}

interface ApplicationDetails {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_id: string;
  phone: string;
  role: string;
  categories: Category[];
  cv_path: string;
  is_approved: boolean;
}

const ApplicationDetailsPage = () => {
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [countryName, setCountryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/users/applications/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch application');
        const data = await response.json();
        setApplication(data);

        if (data.country_id) {
          const countryResponse = await fetch(`/api/country/${data.country_id}`);
          if (countryResponse.ok) {
            const countryData = await countryResponse.json();
            setCountryName(countryData.data.country_name);
          } else {
            setCountryName('Country not found');
          }
        }
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
          <CircularProgress color="primary" />
        </Box>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color={colorPalette.darkBlue}>
            Application not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box my={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom color={colorPalette.mediumBlue}>
              Application Details
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemText 
                  primary="Name" 
                  secondary={`${application.first_name} ${application.last_name}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={application.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Phone" secondary={application.phone} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Country" secondary={countryName || 'N/A'} />
              </ListItem>
              <ListItem>
                <Box>
                  <Typography variant="subtitle1" color={colorPalette.darkBlue}>
                  Categories
                  </Typography>
                  {application.categories.length > 0 ? (
                  <ul>
                    {application.categories.map((category) => (
                    <li key={category._id}>{category.category_name}</li>
                    ))}
                  </ul>
                  ) : (
                  <Typography variant="body2" color="textSecondary">
                    No categories assigned
                  </Typography>
                  )}
                </Box>
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" color={colorPalette.darkBlue} gutterBottom>
              CV Preview:
            </Typography>
            <Box 
              mt={2} 
              sx={{ 
                border: `1px solid ${colorPalette.lightBlue}`, 
                borderRadius: 2, 
                overflow: 'hidden' 
              }}
            >
              {application.cv_path ? (
                <iframe
                  src={application.cv_path}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                  title="CV Preview"
                />
              ) : (
                <Typography textAlign="center" color={colorPalette.darkBlue}>
                  No CV provided
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} mt={4} justifyContent="center">
              <Button
                variant="contained"
                sx={{ 
                  background: colorPalette.gradientButton, 
                  color: 'white' 
                }}
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Reject
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ApplicationDetailsPage;
