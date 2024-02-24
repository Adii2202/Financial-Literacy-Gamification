import React, { useEffect, useState } from 'react';
import Bar from '../avatar/Bar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import { IconButton, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import sword from '../../assets/sword.png'
import shield from '../../assets/shield.png'
import Center from '../../animated-components/Center.jsx'

const Fighting = ({ user, partyInfo, change, setChange }) => {
    const [open, setOpen] = useState(false);
    const [userWon, setUserWon] = useState(partyInfo.opp.health == 0)

    useEffect(() => {
        if (partyInfo.opp.health == 0) {
            setUserWon(true)
            setOpen(true)
        }
    }, [partyInfo])

    return (
        <Center>
            {open && (<Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
             <div className='text-2xl font-semibold tracking-wide flex flex-col items-center justify-center gap-2'>
                Congratulations on Beating the {partyInfo.opp.name}!
                <button className='bg-cobalt p-2.5 rounded-md active:bg-cobalt text-xl hover:bg-d-blue'>
                    Continue
                </button>
            </div>   
            </Backdrop>)}
            <div className='fight-bg w-full h-full'>
                <div className='w-full h-full flex items-center justify-between p-4'>
                    <div className='w-[30%] flex flex-col items-start gap-8'>
                        {partyInfo.members.map((member, i) => (
                            <div
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Whitish background with transparency
                                    backdropFilter: 'blur(20px)', // Reduce blur for a smoother effect
                                    padding: '10px',
                                    borderRadius: '1rem',
                                    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )', // Add shadow for depth
                                    backdropFilter: 'blur( 4px )',
                                    borderRadius: '10px',
                                    border: '1px solid rgba( 255, 255, 255, 0.18 )',
                                }}
                                className='w-full flex items-center justify-start gap-4'>
                                <div className='w-full flex flex-col'>
                                    <div className='w-full text-center font-semibold text-white mb-3'>
                                        {member.name}
                                    </div>
                                    <div className='flex '>
                                        <img
                                            src={member.gaming.avatar.image}
                                            alt="avatar"
                                            className='w-[30%] h-[30%]'
                                        />
                                        <div className='w-[60%] flex flex-col items-start'>
                                            <div className='w-full flex flex-col gap-2 p-1'>
                                                <Bar name='Health' icon={<FavoriteIcon className='text-red' />} value={member.gaming.health} maxValue={member.gaming.maxHealth} desc="The Health Bar indicates your health, Once it goes below 0 your level will be lowered!" barstyle="bg-red" />
                                                {/* <Bar name='Experience' icon={<StarIcon className='text-yellow' />} value={member.gaming.exp} maxValue={member.gaming.maxExp} desc="The Experience Bar indicates your experience, Once it goes above the maximum value you will level up!!" barstyle="bg-yellow" /> */}
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <img src={sword} alt="" width={25} />
                                                        <span className='text-lg font-bold'>{member.gaming.avatar.attack}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <img src={shield} alt="" width={25} />
                                                        <span className='text-lg font-bold'>{member.gaming.avatar.defense}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-full flex items-center justify-between'>
                                                <div className='flex items-center'>
                                                    <Tooltip arrow title="This is your current health and title">
                                                        <IconButton>
                                                            <ShieldIcon className='text-[#06447c] !text-3xl' />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <span className='text-[#06447c] font-bold tracking-wide'>
                                                        Level {member.gaming.level}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)', // Whitish background with transparency
                            backdropFilter: 'blur(20px)', // Reduce blur for a smoother effect
                            padding: '10px',
                            borderRadius: '1rem',
                            boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )', // Add shadow for depth
                            backdropFilter: 'blur( 4px )',
                            borderRadius: '10px',
                            border: '1px solid rgba( 255, 255, 255, 0.18 )',
                        }}
                        className='w-[40%] h-full flex flex-col items-center justify-start gap-4'>
                        <div className='text-2xl font-bold text-white tracking-wide'>
                            Battle Logs
                        </div>
                        <div className='mt-4 flex flex-col items-start gap-4 overflow-y-auto overscroll-y-auto'>
                            {partyInfo.logs.map((log, i) => (
                                <div key={i} className='w-full flex items-center justify-start gap-4'>
                                    <div className='w-full flex flex-col items-start gap-2 p-1'>
                                        <div className='w-full flex items-center justify-start gap-2'>
                                            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-red text-white'>
                                                {i + 1}
                                            </div>
                                            <div className='w-full flex items-center justify-start gap-2 text-white font-semibold tracking-wide'>
                                                {log}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.25)', // Whitish background with transparency
                                backdropFilter: 'blur(20px)', // Reduce blur for a smoother effect
                                padding: '10px',
                                borderRadius: '1rem',
                                boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )', // Add shadow for depth
                                backdropFilter: 'blur( 4px )',
                                borderRadius: '10px',
                                border: '1px solid rgba( 255, 255, 255, 0.18 )',
                            }}
                            className='w-full flex items-center justify-start gap-4'>
                            <div className='w-full flex flex-col items-center justify-center'>
                                <div className='w-full text-center font-semibold text-white mb-3'>
                                    {partyInfo.opp.name}
                                </div>
                                <img
                                    src={partyInfo.opp.image}
                                    alt="avatar"
                                    className='w-[50%] h-[50%]'
                                />
                                <div className='w-full flex flex-col items-center justify-center'>
                                    <div className='w-[90%] flex flex-col items-start'>
                                        <div className='w-full flex flex-col gap-2 p-1'>
                                            <Bar name='Health' icon={<FavoriteIcon className='text-red' />} value={partyInfo.opp.health} maxValue={partyInfo.opp.maxHealth} desc="The Health Bar indicates your health, Once it goes below 0 your level will be lowered!" barstyle="bg-red" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <img src={partyInfo.opp.image} alt="Dragon" className='w-72' /> */}
                    </div>
                </div>
            </div>
        </Center>
    );
};

export default Fighting;