import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FiMousePointer } from "react-icons/fi";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import { motion } from "framer-motion";
import Api from '../../api';

const InvCard = ({ item, itemtype, handleClickOpen, setType, setSelectedItem, setItemType }) => {
    console.log(item)
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const equipAvatar = async () => {
        await Api.setAvatar({ email: JSON.parse(localStorage.getItem('user')).email, avatar: item })
            .then((res) => {
                console.log('Avatar set:', res.data);
                // setType('avatar')
                // setSelectedItem(item)
                // handleClickOpen()
                window.location.reload()
            })
            .catch((error) => {
                console.error('Error setting avatar:', error);
            });
    }

    const boxShadow = isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none";
    const scale = isHovered ? 1.05 : 1;
    
    return (
        <motion.div
            className='w-56 h-72 rounded-lg p-2 bg-white shadow-lg relative flex flex-col items-center justify-center gap-4 cursor-pointer'
            whileHover={{ scale }}
            style={{ boxShadow }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='absolute top-0 right-0'>
                <Tooltip arrow title={item.desc}>
                    <IconButton>
                        <InfoOutlinedIcon className='text-[#06447c]' />
                    </IconButton>
                </Tooltip>
            </div>
            <img
                src={item.image}
                // src='/assets/avatars/a-2.png'
                alt="avatar"
                className='w-32 h-32'
            />
            <div className='h-16'>
                {item.name && (
                    <div className='font-semibold w-full text-center'>
                        {item.name}
                    </div>
                )}
            </div>
            {item.attack && (<button onClick={equipAvatar} className='p-2.5 rounded-md w-24 text-white flex items-center !text-center bg-cobalt active:bg-cobalt hover:bg-d-blue'>
                <span className='ml-3'>Equip</span>
            </button>)}
        </motion.div>
    );
};

export default InvCard;
