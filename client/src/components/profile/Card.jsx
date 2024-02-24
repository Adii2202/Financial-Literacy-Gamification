import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FiMousePointer } from "react-icons/fi";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import { motion } from "framer-motion";

const Card = ({ item, itemtype, handleClickOpen, setType, setSelectedItem, setItemType }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (itm) => {
        console.log(itm)
        // setType(type)
        setItemType(itemtype)
        setSelectedItem(item) 
        handleClickOpen()
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

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
                src={item.img}
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
            <button 
            onClick={() => {
                handleClick(item)
            }}
            className='bg-[#06447c] text-white p-2 rounded-md hover:bg-l-blue active:bg-[#06447c]'>
                Buy Now
            </button>
        </motion.div>
    );
};

export default Card;
