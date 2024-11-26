"use client";

import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import JobCard from "@/app/(components)/JobCard";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";

const Page = () => {
  const Jobs = [
    // Data awal
    {
      id: 1,
      postedTime: "2 hours ago",
      title: "Full Stack Developer",
      paymentVerified: true,
      rating: "★★★★☆",
      location: "Remote",
      category: "Web Development",
      tenure: "Full-time",
      salaryRange: "$4,000 - $6,000/month",
      description:
        "We are looking for a full-stack developer with experience in MERN stack to build and maintain scalable applications.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      tokens: "7 tokens",
    },
    {
      id: 2,
      postedTime: "30 minutes ago",
      title: "Data Scientist",
      paymentVerified: false,
      rating: "★★★☆☆",
      location: "On-site",
      category: "Data Science",
      tenure: "Contract",
      salaryRange: "$5,000 - $7,000/month",
      description:
        "Seeking an experienced data scientist to analyze complex datasets and develop predictive models.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      tokens: "6 tokens",
    },
    {
      id: 3,
      postedTime: "10 minutes ago",
      title: "UI/UX Designer",
      paymentVerified: true,
      rating: "★★★★★",
      location: "Hybrid",
      category: "Design",
      tenure: "Part-time",
      salaryRange: "$3,000 - $4,500/month",
      description:
        "Looking for a creative UI/UX designer to improve user interfaces and user experiences for web and mobile applications.",
      skills: ["Figma", "Sketch", "Wireframing", "Prototyping"],
      tokens: "4 tokens",
    },
    // Data tambahan
    {
      id: 4,
      postedTime: "1 day ago",
      title: "Mobile App Developer",
      paymentVerified: true,
      rating: "★★★★☆",
      location: "Remote",
      category: "Mobile Development",
      tenure: "Full-time",
      salaryRange: "$3,500 - $5,000/month",
      description:
        "Seeking a skilled mobile app developer to create innovative iOS and Android applications.",
      skills: ["Kotlin", "Swift", "React Native", "Firebase"],
      tokens: "5 tokens",
    },
    {
      id: 5,
      postedTime: "3 hours ago",
      title: "Cloud Engineer",
      paymentVerified: true,
      rating: "★★★★☆",
      location: "Remote",
      category: "Cloud Computing",
      tenure: "Contract",
      salaryRange: "$6,000 - $8,000/month",
      description:
        "We are looking for a cloud engineer to manage and optimize cloud infrastructure for our growing platform.",
      skills: ["AWS", "Azure", "Docker", "Kubernetes"],
      tokens: "8 tokens",
    },
    {
      id: 6,
      postedTime: "5 hours ago",
      title: "Technical Writer",
      paymentVerified: false,
      rating: "★★★☆☆",
      location: "Remote",
      category: "Content Writing",
      tenure: "Part-time",
      salaryRange: "$2,500 - $3,500/month",
      description:
        "Hiring a technical writer to produce clear and concise documentation for technical projects.",
      skills: ["Technical Writing", "Markdown", "API Documentation", "SEO"],
      tokens: "3 tokens",
    },
    {
      id: 7,
      postedTime: "2 days ago",
      title: "Cybersecurity Analyst",
      paymentVerified: true,
      rating: "★★★★★",
      location: "On-site",
      category: "Cybersecurity",
      tenure: "Full-time",
      salaryRange: "$7,000 - $10,000/month",
      description:
        "Looking for an experienced cybersecurity analyst to protect systems and networks from cyber threats.",
      skills: ["Network Security", "Penetration Testing", "SIEM", "Firewalls"],
      tokens: "10 tokens",
    },
    {
      id: 8,
      postedTime: "12 hours ago",
      title: "Digital Marketing Specialist",
      paymentVerified: false,
      rating: "★★★☆☆",
      location: "Hybrid",
      category: "Marketing",
      tenure: "Contract",
      salaryRange: "$3,000 - $5,000/month",
      description:
        "Seeking a digital marketing specialist to enhance our online presence through SEO and social media campaigns.",
      skills: ["SEO", "Google Analytics", "Social Media Marketing", "PPC"],
      tokens: "5 tokens",
    },
    {
      id: 9,
      postedTime: "6 hours ago",
      title: "DevOps Engineer",
      paymentVerified: true,
      rating: "★★★★☆",
      location: "Remote",
      category: "DevOps",
      tenure: "Full-time",
      salaryRange: "$6,500 - $9,000/month",
      description:
        "We are hiring a DevOps engineer to improve deployment pipelines and manage cloud infrastructure.",
      skills: ["CI/CD", "Jenkins", "Docker", "Kubernetes"],
      tokens: "7 tokens",
    },
    {
      id: 10,
      postedTime: "8 hours ago",
      title: "Frontend Developer",
      paymentVerified: true,
      rating: "★★★★☆",
      location: "Remote",
      category: "Web Development",
      tenure: "Part-time",
      salaryRange: "$3,000 - $4,000/month",
      description:
        "Looking for a frontend developer with a strong grasp of modern JavaScript frameworks to build responsive web interfaces.",
      skills: ["HTML", "CSS", "JavaScript", "Vue.js"],
      tokens: "4 tokens",
    },
  ];

  // State untuk filter
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRemote, setFilterRemote] = useState(false);
  const [filterFulltime, setFilterFulltime] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(Jobs);

  // Logika Filter
  const applyFilters = () => {
    let filtered = Jobs;

    if (filterVerified) {
      filtered = filtered.filter((job) => job.paymentVerified);
    }

    if (filterRemote) {
      filtered = filtered.filter((job) => job.location === "Remote");
    }

    if (filterFulltime) {
      filtered = filtered.filter((job) => job.tenure === "Full-time");
    }

    setFilteredJobs(filtered);
  };

  // Handle perubahan checkbox
  const handleFilterChange = (event, filterType) => {
    const { checked } = event.target;

    if (filterType === "verified") {
      setFilterVerified(checked);
    } else if (filterType === "remote") {
      setFilterRemote(checked);
    } else if (filterType === "fulltime") {
      setFilterFulltime(checked);
    }
  };

  // Update filteredJobs saat state filter berubah
  React.useEffect(() => {
    applyFilters();
  }, [filterVerified, filterRemote, filterFulltime]);

  return (
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: "#002244",
          minHeight: "100vh",
          padding: 4,
          display: "grid",
          gridTemplateColumns: "300px 1fr", // Kolom kiri untuk filter, kanan untuk job card
          gap: 3,
        }}
      >
        {/* Filter Box */}
        <Box
          sx={{
            backgroundColor: "#003366",
            color: "#fff",
            padding: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            Filter Jobs
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterVerified}
                onChange={(event) => handleFilterChange(event, "verified")}
              />
            }
            label="Payment Verified"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterRemote}
                onChange={(event) => handleFilterChange(event, "remote")}
              />
            }
            label="Remote Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterFulltime}
                onChange={(event) => handleFilterChange(event, "fulltime")}
              />
            }
            label="Full-time"
          />
        </Box>

        {/* Job Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
          }}
        >
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Page;
