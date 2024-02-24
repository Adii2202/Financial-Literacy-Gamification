import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BuyModal from './BuyModal';
import { avatarData } from '../../data/avatarData';
import { potions } from '../../data/potionData';
import { boosts } from '../../data/boostData';
import InvCard from './InvCard';
import Card from './Card';

const Inventory = ({ user }) => {
    const [value, setValue] = useState('1');
    const [avatarList, setAvatarList] = useState();
    const [potionList, setPotionList] = useState();
    const [boostList, setBoostList] = useState();
    const [loading, setLoading] = useState(true)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const { avatar, potions, boosts } = user.inventory;

        // Extract avatars
        const avatarList = avatar ? avatar : [];

        // Extract potions
        const potionList = potions ? potions : [];

        // Extract boosts
        const boostList = boosts ?  boosts : [];

        // console.log(avatarList, potionList, boostList)

        // Set state for each list
        setAvatarList(avatarList);
        setPotionList(potionList);
        setBoostList(boostList);
        setLoading(false);
    }, [])

    return (
        <div className='w-full'>
            <Box sx={{ width: '100%', height: "100%", borderRadius: "20px", typography: 'body1' }}>
                <TabContext sx={{ borderRadius: "20px" }} value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: "20px" }}>
                        <TabList value={value}
                            onChange={handleChange}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'white',
                                },
                                '& .MuiTab-root': {
                                    color: 'white',
                                    fontWeight: '',
                                    padding: "0 4rem",
                                    letterSpacing: '0.1rem',
                                    fontSize: '0.8rem',
                                },

                                '& .Mui-selected': {
                                    color: "white",
                                },
                                backgroundColor: '#06447c',
                            }}
                            aria-label="secondary tabs example" centered>
                            <Tab sx={{
                                color: 'white !important',
                            }} label="Avatars" value="1" />
                            <Tab sx={{
                                color: 'white !important',
                            }} label="Potions" value="2" />
                            <Tab sx={{
                                color: 'white !important',
                            }} label="Boosts" value="3" />
                        </TabList>
                    </Box>
                    {loading ? (
                        <div>
                            loading
                        </div>
                    ) :
                       ( <>
                            {user.inventory ?
                                (<>
                                    <TabPanel value="1">
                                        {avatarList.length > 0 ? (<div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                                            {avatarList.map((item, index) => {
                                                // if (index == 0) {
                                                //     return
                                                // }
                                                return (
                                                    <InvCard item={item} />
                                                )
                                            })}
                                        </div>) : (
                                            <div>
                                                No Avatars in Inventory 
                                            </div>
                                        )}
                                    </TabPanel>
                                    <TabPanel value="2">
                                        {potionList.length > 0 ? (<div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                                            {potionList.map((item, index) => {
                                                // console.log(item)
                                                return (
                                                    <InvCard item={item} />
                                                )
                                            })}
                                        </div>) : (
                                            <div>
                                                No Potions in Inventory
                                            </div>
                                        )}
                                    </TabPanel>
                                    <TabPanel value="3">
                                       {boostList.length > 0 ? (<div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                                            {boostList.map((item, index) => {
                                                console.log(item)
                                                return (
                                                    <InvCard item={item} />
                                                )
                                            })}
                                        </div>) : (
                                            <div>
                                                No Boosts in Inventory
                                            </div>
                                        )}
                                    </TabPanel>
                                </>) : (
                                    <div className='w-full text-center font-bold text-2xl my-8'>
                                        Inventory is Empty!!
                                    </div>
                                )}
                        </>)}
                </TabContext>
            </Box>
        </div>
    );
};

export default Inventory;