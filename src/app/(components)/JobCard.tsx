import React from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

const JobCard = (props) => {
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
        <Typography variant="subtitle2">Posted {props.postedTime}</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {props.title}
        </Typography>
        <Typography variant="body2">
          {props.paymentVerified
            ? "✅ Payment Verified"
            : "❌ Payment Not Verified"}{" "}
          · Rating {props.rating} · {props.location}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, marginBottom: 2 }}>
          {props.category} · {props.tenure} · {props.salaryRange}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          {props.description}
        </Typography>
        <Stack direction="row" spacing={1}>
          {props.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{ backgroundColor: "#6aaede", color: "#fff" }}
            />
          ))}
        </Stack>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Job Tokens: {props.tokens}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobCard;
