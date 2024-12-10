import DetailJob from "@/app/(components)/DetailJob";
import Footer from "@/app/(components)/Footer";
import Header from "@/app/(components)/Header";
import Reviews from "@/app/(components)/Reviews";
import { Box } from "@mui/material";
import React from "react";

const colors = {
  primary: "#001F3F",
  secondary: "#3A6D8C",
  accent: "#6A9AB0",
  text: "#EAD8B1",
};

const PostDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div>
      <Header />
      <Box sx={{
        backgroundColor: colors.primary,
        color: colors.text,
        }}>
      <DetailJob id={id} />
      <Reviews id={id} />
      <Footer />
      </Box>
    </div>
  );
};

export default PostDetailPage;