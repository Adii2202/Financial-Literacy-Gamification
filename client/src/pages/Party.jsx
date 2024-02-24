import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import sword from '../assets/sword.png'
import shield from '../assets/shield.png'
import NewParty from '../components/party/NewParty';
import Fighting from '../components/party/Fighting';
import Api from '../api';
import { toast } from 'react-toastify';

const Party = () => {
    const [user, setUser] = useState();
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
    const [usersList, setUsersList] = useState([])
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [partyInfo, setPartyInfo] = useState({});
    const [allJoined, setAllJoined] = useState(false);
    const [partyStarted, setPartyStarted] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchUser = async () => {
            let currUser = null
            await Api.getUser({ email: userInfo.email })
                .then((res) => {
                    console.log('User:', res.data);
                    currUser = res.data.user
                    setUser(res.data.user);
                    // if (res.data.user.partyId) {
                    //     setPartyStarted(true)
                    // }
                    // setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });

            if (currUser && currUser.partyId) {
                console.log(currUser.partyId)
                await Api.getParty({ partyId: currUser.partyId })
                    .then((res) => {
                        console.log('Party:', res.data);
                        setPartyInfo(res.data.party);
                        if (res.data.party.isFighting) {
                            setPartyStarted(true)
                        }
                        let flag = 1
                        res.data.party.members.forEach((member) => {
                            if (!member.isJoined) {
                                flag = 0
                            }
                        })
                        if (flag) {
                            setAllJoined(true)
                        }
                        else {
                            setAllJoined(false)
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching party:', error);
                    });

            }

            await Api.getAllUsers()
                .then((res) => {
                    console.log('All Users:', res.data);
                    setUsersList(res.data.users);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching all users:', error);
                });
        };
        fetchUser();
    }, []);

    const handleStartParty = async () => {
        // await Api.
        if (!allJoined) {
            toast.error('Please wait for all members to get ready!');
            return;
        }
        await Api.startFight({ partyId: partyInfo._id })
            .then((res) => {
                console.log('Party started:', res.data);
                toast.success('Party started successfully!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error starting party:', error);
                toast.error('Error starting party');
            });
    }

    return (
        <div className='w-full h-screen'>
            {loading ?
                (
                    <div className='w-full h-full flex items-center justify-center'>
                        <CircularProgress />
                    </div>
                )
                : (
                    <div className='w-full h-full'>
                    {partyStarted ?
                    (
                        <div>
                            <Fighting user={user} partyInfo={partyInfo} change={change} setChange={setChange} />
                        </div>
                    ) 
                    : (<div className='w-full h-full p-4'>
                        {!user.partyId ?
                            (<NewParty usersList={usersList} user={user} change={change} setChange={setChange} />)
                            :
                            (<div className='w-full h-full flex flex-col items-center justify-start gap-4 mt-12'>
                                <div className='text-3xl font-bold'>
                                    You are already in a party!
                                </div>
                                <div className='mt-[-10px]'>
                                    {user.email === partyInfo.members[0].email ?"You can start the party after everyone is ready." : "Please wait for the party leader to start the party."} 
                                </div>
                                <div className='mt-12 bg-white rounded-md shadow-lg relative flex flex-col items-center justify-center p-4'>
                                    {user.email === partyInfo.members[0].email && (<button onClick={handleStartParty} className='absolute top-4 right-4 bg-cobalt p-2.5 rounded-md hover:bg-d-blue active:bg-cobalt text-white'>
                                        Start Party
                                    </button>)}
                                    <div className='text-2xl font-bold'>
                                        Party Name: {partyInfo.partyName}
                                    </div>
                                    <div className='mt-[10px]'>
                                        Party Leader: {partyInfo.members[0].name}
                                    </div>
                                    <div className='mt-4 '>
                                        {partyInfo.members.map((member) => (
                                            <div key={member.email} className='flex items-center justify-center gap-4 mx-4'>
                                                <img
                                                    src={member.gaming.avatar.image}
                                                    alt="avatar"
                                                    className='w-[10%] h-[10%]'
                                                />
                                                <div className='w-[30%] flex flex-col items-start gap-4'>
                                                    <div className='w-full'>
                                                        <div className='text-xl font-bold'>
                                                            {member.name}
                                                        </div>

                                                    </div>
                                                    <div className='mt-[-10px]'>
                                                        {member.email}
                                                    </div>
                                                </div>
                                                <div className='w-[20%] flex items-center gap-2'>
                                                    <div className='flex gap-1.5'>
                                                        <img src={sword} alt="sword" width={25} /> <span className='text-xl font-bold'>{member.gaming.avatar.attack}</span>
                                                    </div>
                                                    <div>
                                                        |
                                                    </div>
                                                    <div className='flex gap-1.5'>
                                                        <img src={shield} alt="shield" width={25} /> <span className='text-xl font-bold'>{member.gaming.avatar.defense}</span>
                                                    </div>
                                                </div>
                                                <div className='w-[20%]'>
                                                    {member.isJoined ?
                                                        (
                                                            // <Chip
                                                            //     label="Ready"
                                                            //     color="primary"
                                                            // />
                                                            <div className='font-bold text-xl bg-d-blue text-white p-2.5 text-center rounded-xl'>
                                                                Ready
                                                            </div>
                                                        )
                                                        :
                                                        (
                                                            <div className='font-bold text-xl bg-red text-white p-2.5 text-center rounded-xl'>
                                                                Not Ready
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>)}
                    </div>
                )}
        </div>
    );
};

export default Party;