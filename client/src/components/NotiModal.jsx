import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import financeQuestions from '../data/dailyData';
import Api from '../api';

const NotiModal = ({ open, handleClose, userInfo }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState();
    const [notifications, setNotifications] = useState([])
    const [partyId, setPartyId] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            await Api.getUser({ email: userInfo.email })
                .then((res) => {
                    console.log('User:', res.data);
                    setUser(res.data.user);
                    setNotifications(res.data.user.notifications);
                    setPartyId(res.data.user.notifications[0]?.info.partyId || null);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }
        fetchUser();
    }, [])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const handleAccept = async () => {
        await Api.acceptInvite({
            email: userInfo.email,
            partyId: partyId
        })
        .then(async(res) => {
            console.log('Invite accepted:', res.data);
            toast.success('Party invite accepted successfully!');
            handleClose();
            await timeout(1000);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error accepting party invite:', error);
            toast.error('Error accepting party invite');
        });
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Your Notifications
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {loading ?
                            <div>
                                <CircularProgress />
                            </div>
                            : (<>
                                {notifications.length > 0 ? (<div>
                                    {notifications.map((notification, index) => {
                                        return (
                                            <div className='w-full flex flex-col items-end gap-4'>
                                                <div className='text-black font-medium' key={index}>
                                                    {notification.title}
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <Button variant='contained' onClick={handleAccept}>Accept</Button>
                                                    <Button color='error' variant='contained' onClick={handleClose}>Reject</Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>) : <div>No notifications to show</div>}
                            </>)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default NotiModal;
