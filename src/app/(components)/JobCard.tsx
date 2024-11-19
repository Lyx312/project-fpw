import React from "react";
import { Box, Card, CardContent, Typography, Chip, Stack } from "@mui/material";

const JobCard = () => {
  return (
    <Card
      sx={{
        backgroundColor: "#558cb8",
        color: "#fff",
        marginBottom: 2,
        padding: 2,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <CardContent>
        <Typography variant="subtitle2">
          Posted... Seconds/Minutes Ago
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Job Title
        </Typography>
        <Typography variant="body2">
          ✅ Payment Verified · Rating ★★★★★ · Location
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, marginBottom: 2 }}>
          Category · Tenure · Range Salary
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Job Description
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Skill Requirements"
            sx={{ backgroundColor: "#6aaede", color: "#fff" }}
          />
          <Chip
            label="Skill Requirements"
            sx={{ backgroundColor: "#6aaede", color: "#fff" }}
          />
          <Chip
            label="Skill Requirements"
            sx={{ backgroundColor: "#6aaede", color: "#fff" }}
          />
          <Chip
            label="Skill Requirements"
            sx={{ backgroundColor: "#6aaede", color: "#fff" }}
          />
        </Stack>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Job Tokens: Less than 8
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobCard;
