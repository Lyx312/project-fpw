import {
    Box,
    IconButton,
    Typography
  } from '@mui/material';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon
  } from '@mui/icons-material';
  
function SocialMediaIcons() {
    return (
        <Box>
            <Typography>Follow Us:</Typography>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <IconButton>
                <FacebookIcon />
            </IconButton>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <IconButton>
                <TwitterIcon />
            </IconButton>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <IconButton>
                <InstagramIcon />
            </IconButton>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <IconButton>
                <YouTubeIcon />
            </IconButton>
            </a>
        </Box>
    );
  }
  
  export default SocialMediaIcons;
  