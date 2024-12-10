/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getCurrUser } from "@/utils/utils";
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";

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
          setCurrUser(user as any);

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
      <Container>
        <CircularProgress />
        <Typography variant="h6" align="center" marginTop={2}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <>
    <Header/>
      {currUser ? (
        <>
          <Typography variant="h4" gutterBottom>
            Posts by {currUser.first_name} {currUser.last_name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPost}
            style={{ marginBottom: "1rem" }}
          >
            Add Post
          </Button>
          <Grid container spacing={3}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Card
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditPost(post.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{post.title}</Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {post.description}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Price:</strong> ${post.price}
                      </Typography>
                      <Typography variant="body2">
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
              <Typography variant="h6" color="textSecondary">
                No posts found for this user.
              </Typography>
            )}
          </Grid>
        </>
      ) : (
        <Typography variant="h6" color="error">
          No user data available.
        </Typography>
      )}
      <Footer/>
    </>
  );
};

export default FreelancerPostsPage;