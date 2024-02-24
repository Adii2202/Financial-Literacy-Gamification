import * as React from 'react';
import Button from '@mui/material/Button';
import Home from '../components/blog/pages/Home'
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { CircularProgress } from '@mui/material';
import Center from '../animated-components/Center';
import axios from 'axios';

const BlogHome = () => {
    const [blogs, setBlogs] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()
    function goToAddBlog() {
        navigate("/AddBlog")
    }

    React.useEffect(() => {
        const fetchData = async () => {
        const options = {
            method: 'GET',
            url: 'https://reuters-business-and-financial-news.p.rapidapi.com/article-date/2024-01-01/0/10',
            headers: {
              'X-RapidAPI-Key': 'eba3c8fc44msh1b0890ac61ac64bp1ccc70jsn0aeac77991e1',
              'X-RapidAPI-Host': 'reuters-business-and-financial-news.p.rapidapi.com'
            }
          };
          console.log('fetching data')
          try {
              const response = await axios.request(options);
              setBlogs(response.data)
              localStorage.setItem('blogs', JSON.stringify(response.data))
              console.log(response.data);
              setLoading(false)
          } catch (error) {
              console.error(error);
          }
        }
        fetchData()
    }, [])

    return (
        <div className="w-full h-full p-4">
            {/* <Button variant="contained" onClick={goToAddBlog} className=" items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add a new blog
            </Button> */}
            <Center>
            {loading ? 
            (
                <div className='w-full h-screen flex items-center justify-center'>
                    <CircularProgress />
                </div>
            )
            : 
            (<Home allBlogs={blogs} />)
        }
            {/* <IconButton onClick={goToAddBlog} 
            className='hover:!bg-[#5677fc]'
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 100,
                backgroundColor: '#3f51b5',
                color: 'white'
                // hover background colour change
            }}>
                <AddOutlinedIcon sx={{
                    fontSize: 40
                }} />
            </IconButton> */}
            </Center>
        </div>
    );
};

export default BlogHome;