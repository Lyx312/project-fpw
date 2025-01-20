"use client";
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
import Header from "@/app/(components)/Header";
import Footer from "@/app/(components)/Footer";
import Loading from "../../loading";
import { ICategory } from "@/models/categoryModel";
import { useAppSelector } from "@/app/redux/hooks";

interface Post {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: ICategory[];
  postMaker: string;
  createdAt: string;
}


const FreelancerPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colors = {
    primary: "#001F3F",
    secondary: "#3A6D8C",
    accent: "#6A9AB0",
    text: "#EAD8B1",
  };
  const currUser = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        if (currUser._id) {
          // Fetch posts for the current user
          const res = await fetch(`/api/posts?freelancerId=${currUser.email}`);
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
    return <Loading />;
  }

  return (
    <>
      <Header />
      {currUser._id ? (
        <Box sx={{ padding: "2rem", backgroundColor: colors.primary }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: colors.text, fontWeight: "bold" }}
          >
            Posts by {currUser.first_name} {currUser.last_name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPost}
            sx={{
              marginBottom: "1rem",
              backgroundColor: "#4B6CB7",
              "&:hover": { backgroundColor: "#3A5B8D" },
              padding: "0.8rem 2rem",
              color: colors.text
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
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component={"p"}
                        gutterBottom
                      >
                        {post.description}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        <strong>Price:</strong> Rp. {post.price.toLocaleString("id-ID")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#777" }}>
                        <strong>Categories:</strong>{" "}
                        {Array.isArray(post.categories) ? post.categories.map((category) => category.category_name).join(", ") : "No categories"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Created At:</strong>{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                color="textSecondary"
                align="center"
                sx={{ width: "100%" }}
              >
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
