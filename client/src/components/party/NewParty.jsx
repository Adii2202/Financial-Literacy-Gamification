import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import Api from '../../api';
import { toast } from 'react-toastify';

const NewParty = ({ usersList, user, change, setChange }) => {
    const [partyName, setPartyName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [emailList, setEmailList] = useState([]);

    const handleUserChange = (event, newValue) => {
        setSelectedUsers(newValue);
        const emailList = newValue.map((user) => user.email);
        setEmailList(emailList);
        console.log("Email list:", emailList)
    };

    const handleCreateParty = async () => {
        if (partyName === '') {
            toast.error('Please enter a party name');
            return;
        }
        if (selectedUsers.length === 0) {
            toast.error('Please select at least one user');
            return;
        }
        await Api.sendInvite({
            senderName: user.name,
            receiverEmails: emailList,
            partyName: partyName,
            email: user.email
        })
        .then((res) => {
            console.log('Invite sent:', res.data);
            toast.success('Party invite sent successfully!');
            setChange(!change);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error sending party invite:', error);
            toast.error('Error sending party invite');
        });
    };

    return (
        <div className='flex flex-col items-center justify-center gap-4 mt-8'>
            <div className='text-3xl font-bold'>
                Create a Party now!!
            </div>
            <div className='mt-[-10px]'>
                Join your friends in a quest of challenges to defeat a final boss!!
            </div>
            <div className='w-3/4 flex flex-col gap-8 mt-8'>
                <TextField
                    id="outlined-basic"
                    label="Party Name"
                    variant="outlined"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                />
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={usersList}
                    value={selectedUsers}
                    onChange={handleUserChange}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Party Members"
                            placeholder="Party Members"
                        />
                    )}
                />
            </div>
            <button 
                className='bg-[#06447c] text-white p-2.5 mt-4 rounded-xl w-52 hover:bg-d-blue active:bg-[#06447c]'
                onClick={handleCreateParty}
            >
                Create a Party
            </button>
        </div>
    );
};

export default NewParty;
