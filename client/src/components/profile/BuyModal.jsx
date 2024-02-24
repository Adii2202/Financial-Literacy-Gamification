import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import sword from '../../assets/sword.png'
import shield from '../../assets/shield.png'
import Api from '../../api';
import { toggleprof } from '../../redux/features/profslice';
import { toast } from 'react-toastify';

export default function BuyModal({ open, handleClose, item, itemtype, type }) {
    const user = JSON.parse(localStorage.getItem('user'))
    // console.log(item, itemtype, type)

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const addToInventory = async (type) => {
        console.log(item)
        let updatedItem = null
        if (itemtype == 'avatar') {
            updatedItem = {
                attack: item.atk,
                defense: item.def,
                name: item.name, 
                desc: item.desc,
                image: item.img
            }
        }
        else {
            updatedItem = {
                name: item.name,
                image: item.img,
                desc: item.desc,
                value: item.value
            }
        }
        const data = {
            email: user.email,
            item: updatedItem,
            type: type,
            price: type == 'coins' ? item.coins : item.gems,
            itemType: itemtype
        }
        console.log(data)
        await Api.addToInventory(data)
        .then(async(res) => {
            console.log(res.data)
            toast.success('Purchase Successfull!')
            toggleprof()
            await timeout(1500)
            window.location.reload()
            handleClose()
        })
        .catch((err) => {
            console.log(err)
            if (err.response.status == 400) {
                toast.error(err.response.data.message)
            }
            else{
                toast.error('Something Went Wrong!')
            }
            handleClose()
        })
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to purchase the following {itemtype}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                    id="alert-dialog-description">
                        <div className='flex items-center gap-4'>
                            <div className=''>
                                <img src={item.img} alt="avatar" className='w-52 h-48' />
                            </div>
                            {itemtype === 'avatar' ? 
                            (
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='font-semibold text-xl text-center text-black'>
                                        {item.name}
                                    </div>
                                    <div className='flex items-center gap-2 font-bold text-black'>
                                        <span>
                                            <img src={sword} alt="sword" width={45} />
                                        </span>
                                        <span className='text-3xl'>
                                            {item.atk}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2 font-bold text-black'>
                                        <span>
                                            <img src={shield} alt="sword" width={45} />
                                        </span>
                                        <span className='text-3xl'>
                                            {item.def}
                                        </span>
                                    </div>
                                </div>
                            )
                            : (<div className='text-black font-semibold text-lg'>
                                {item.desc}
                            </div>)}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => (
                        addToInventory('coins')
                    )} className='!flex !items-center !text-[#FF9900]'>
                        <MonetizationOnIcon className='!text-2xl' />
                        <span className='ml-1 text-lg'>
                            {item.coins}
                        </span>
                    </Button>
                    <Button
                    onClick={() => {
                        addToInventory('gems')
                    }} 
                    className='!flex !items-center !text-[#50C878]'>
                        <DiamondIcon className='!text-2xl' />
                        <span className='ml-1 text-lg'>
                            {item.gems}
                        </span>
                    </Button>
                    <Button color='error' onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
