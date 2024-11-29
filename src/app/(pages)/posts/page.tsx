"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import JobCard from "@/app/(components)/JobCard";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import axios from "axios";

const Page = () => {
  const Jobs = [
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

  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);

  // Fetch categories from the API
  const fetchCategories = async (filterName = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/posts`);
      setPostList(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  const [filters, setFilters] = useState({
    verified: false,
    remote: false,
    fulltime: false,
  });

  const [filteredJobs, setFilteredJobs] = useState(postList);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = Jobs;

    if (filters.verified) {
      filtered = filtered.filter((job) => job.paymentVerified);
    }

    if (filters.remote) {
      filtered = filtered.filter((job) => job.location === "Remote");
    }

    if (filters.fulltime) {
      filtered = filtered.filter((job) => job.tenure === "Full-time");
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (event, filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: event.target.checked,
    }));
  };

  return (
    <div>
      <Header />
      <Box
        sx={{
          backgroundColor: "#002244",
          minHeight: "100vh",
          padding: 4,
          display: "grid",
          gridTemplateColumns: "300px 1fr",
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
                checked={filters.verified}
                onChange={(event) => handleFilterChange(event, "verified")}
              />
            }
            label="Payment Verified"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.remote}
                onChange={(event) => handleFilterChange(event, "remote")}
              />
            }
            label="Remote Only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.fulltime}
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
          {postList.map((item) => (
            <JobCard
              key={item.post_id}
              id={item.post_id}
              postedTime={new Date(item.createdAt).toLocaleString()} // Atur waktu berdasarkan createdAt
              title={item.post_title}
              paymentVerified={item.post_status === "Verified"} // Misalkan ada status untuk verifikasi
              rating="★★★☆☆" // Jika rating belum tersedia, gunakan default
              location="Remote" // Beri nilai default atau gunakan data dari API jika tersedia
              category="General" // Beri nilai default atau gunakan data dari API
              tenure="Contract" // Beri nilai default atau gunakan data dari API
              salaryRange={`Rp ${item.post_price.toLocaleString("id-ID")}`} // Format harga menjadi salaryRange
              description={item.post_description}
              skills={[]} // Jika data skills tidak ada, gunakan array kosong
              tokens="N/A" // Jika token tidak relevan untuk Manual Post, gunakan "N/A"
            />
          ))}
        </Box>
      </Box>

      {/* Display Manual Post */}

      <Footer />
    </div>
  );
};

export default Page;
