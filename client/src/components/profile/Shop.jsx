import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { avatarData } from '../../data/avatarData';
import { potions } from '../../data/potionData';
import { boosts } from '../../data/boostData';
import BuyModal from './BuyModal';
import Card from './Card';

const Shop = ({ user }) => {
    const [value, setValue] = useState('1');
    const [open, setOpen] = useState(false);
    const [type, setType] = useState()
    const [itemType, setItemType] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const inventory = user.inventory

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    <TabPanel value="1">
                        <div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                            {avatarData.map((item, index) => {
                                if (index == 0) {
                                    return 
                                }
                                return (
                                    <Card item={item} itemtype={"avatar"} setType={setType} setItemType={setItemType} setSelectedItem={setSelectedItem} handleClickOpen={handleClickOpen} />
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                    <div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                            {potions.map((item, index) => {
                                return (
                                    <Card item={item} itemtype={"potion"} setType={setType} setItemType={setItemType} setSelectedItem={setSelectedItem} handleClickOpen={handleClickOpen} />
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel value="3">
                    <div className='w-full flex items-start justify-start gap-4 flex-wrap'>
                            {boosts.map((item, index) => {
                                return (
                                    <Card item={item} itemtype={"boost"} setType={setType} setItemType={setItemType} setSelectedItem={setSelectedItem} handleClickOpen={handleClickOpen} />
                                )
                            })}
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
            {open && (<BuyModal open={open} handleClose={handleClose} item={selectedItem} itemtype={itemType} type={type}/>)}
        </div>
    );
};


export default Shop;