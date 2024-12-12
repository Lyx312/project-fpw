'use client'
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getCurrUser } from "@/utils/utils";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import Loading from "../../loading";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  exp: number;
}

interface Post {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: string[];
  postMaker: string;
  createdAt: string;
}

const FreelancerPostsPage: React.FC = () => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const user = await getCurrUser();
        if (user) {
          setCurrUser(user as unknown as User);

          // Fetch posts for the current user
          const res = await fetch(`/api/posts?freelancerId=${user.email}`);
          const data = await res.json();

          if (res.ok) {
            setPosts(data.data);
          } else {
            console.error("Error fetching posts:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching user or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  const handleAddPost = () => {
    router.push("/freelancer/posts/add");
  };

  const handleEditPost = (id: string) => {
    router.push(`/freelancer/posts/edit/${id}`);
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Header />
      {currUser ? (
        <Box sx={{ padding: "2rem" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#4B6CB7", fontWeight: "bold" }}>
            Posts by {currUser.first_name} {currUser.last_name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPost}
            sx={{
              marginBottom: "1rem",
              backgroundColor: "#4B6CB7",
              '&:hover': { backgroundColor: "#3A5B8D" },
              padding: "0.8rem 2rem",
            }}
          >
            Add Post
          </Button>
          <Grid container spacing={3}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      boxShadow: 3,
                      borderRadius: 2,
                      "&:hover": { boxShadow: 6 },
                    }}
                    onClick={() => handleEditPost(post.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {post.description}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        <strong>Price:</strong> ${post.price.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#777" }}>
                        <strong>Categories:</strong> {post.categories.join(", ")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Created At:</strong> {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="textSecondary" align="center" sx={{ width: "100%" }}>
                No posts found for this user.
              </Typography>
            )}
          </Grid>
        </Box>
      ) : (
        <Typography variant="h6" color="error" align="center">
          No user data available.
        </Typography>
      )}
      <Footer />
    </>
  );
};

export default FreelancerPostsPage;
