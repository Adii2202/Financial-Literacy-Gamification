import React, { useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShieldIcon from '@mui/icons-material/Shield';
import StarIcon from '@mui/icons-material/Star';
import Bar from './Bar';


const AvatarComp = ({ image, user }) => {
    const [health, setHealth] = useState(50);

    const increaseHealth = () => {
        // Increase health value by 10
        setHealth(prevHealth => prevHealth + 10);
    };

    return (
        <div className='w-full h-full flex flex-col items-start gap-4'>
            <div className='text-3xl font-bold text-main-purp'>
                Your Avatar
                {/* <span>
                    <IconButton onClick={increaseHealth}>
                        <SettingsIcon className='!text-3xl' />
                    </IconButton>
                </span> */}
            </div>
            <div className='w-full flex items-center justify-start gap-4'>
                <img
                    src={image}
                    alt="avatar"
                    className='w-[30%] h-[30%]'
                />
                <div className='w-[60%] flex flex-col items-start gap-4'>
                    <div className='w-full flex flex-col gap-2 p-1'>
                        <Bar name='Health' icon={<FavoriteIcon className='text-red' />} value={user.gaming.health} maxValue={user.gaming.maxHealth} desc="The Health Bar indicates your health, Once it goes below 0 your level will be lowered!" barstyle="bg-red" />
                        <Bar name='Experience' icon={<StarIcon className='text-yellow' />} value={user.gaming.exp} maxValue={user.gaming.maxExp} desc="The Experience Bar indicates your experience, Once it goes above the maximum value you will level up!!" barstyle="bg-yellow" />
                    </div>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Tooltip arrow title="This is your current health and title">
                                <IconButton>
                                    <ShieldIcon className='text-[#06447c] !text-3xl' />
                                </IconButton>
                            </Tooltip>
                            <span className='text-[#06447c] font-bold tracking-wide'>
                                Level {user.gaming.level} ({"#" +user.title})
                            </span>
                        </div>
                        <div className='flex'>
                            <div className='flex items-center'>
                                <span>
                                    <Tooltip arrow title="You can use these coins to buy powerups and potions from the shop!">
                                        <IconButton>
                                            <MonetizationOnIcon className='text-[#FF9900] !text-3xl' />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                                <span className='font-bold text-[#FF9900] text-lg'>
                                    {user.coins}
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <span>
                                    <Tooltip arrow title="Gems, unlike coins, are rare and hold even more value. Use them wisely!">
                                        <IconButton>
                                            <DiamondIcon className='text-[#50C878] !text-3xl' />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                                <span className='font-bold text-[#50C878] text-lg'>
                                    {user.gems}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarComp;
