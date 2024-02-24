import React, { useState, useEffect } from 'react';
import Center from '../animated-components/Center';
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Api from "../api";
import AddTaskModal from '../components/AddTaskModal';
import { toast } from 'react-toastify';
import Checkbox from '@mui/material/Checkbox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const TaskPages = () => {
    const [user, setUser] = useState();
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [change, setChange] = useState(false)
    const [pending, setPending] = useState()
    const [completed, setCompleted] = useState()

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        setLoading(true)
        const fetchUser = async () => {
            await Api.getUser({ email: userInfo.email })
                .then((res) => {
                    console.log('User:', res.data);
                    localStorage.setItem('level', res.data.user.gaming.level)
                    const pen = res.data.user.tasks.filter((task) => (!task.isCompleted))
                    const comp = res.data.user.tasks.filter((task) => (task.isCompleted))
                    console.log(pen)
                    console.log(comp)
                    setPending(pen)
                    setCompleted(comp)
                    setUser(res.data.user);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        };
        fetchUser();
    }, [change]);

    const updateTask = async (task) => {
        await Api.setTaskStatus({
            email: user.email,
            id: task._id
        })
            .then((res) => {
                console.log('User:', res.data);
                setChange(!change)
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }

    const formatDate = (dt) => {
        const date = new Date(dt)
        return date.toLocaleDateString()
    }

    const handleDelete = async (task) => {
        // console.log(task)

        await Api.deleteTask({
            email: user.email,
            id: task._id
        })
            .then((res) => {
                console.log('User:', res.data);
                setChange(!change)
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }

    return (
        <Center>
            {loading ?
                (
                    <div className='w-full h-screen flex items-center justify-center'>
                        <CircularProgress />
                    </div>
                )
                : (<div className={`w-full ${completed.length > 0 ? "h-full" : "h-screen"} flex flex-col gap-6 p-4`}>
                    <div className='w-full max-h-1/2'>
                        <div className='w-full p-2 text-2xl font-bold tracking-wide flex items-center'>
                            Pending Financial Habits <span><IconButton onClick={handleClickOpen}><AddCircleRoundedIcon className='!text-3xl' /></IconButton></span>
                        </div>
                        {pending.length > 0 ?
                            (<div className='mt-4 p-2 w-full h-[70%] overscroll-y-auto flex flex-wrap items-start justify-start gap-8'>
                                {pending.map((task) => {

                                    return (
                                        <div style={{
                                            boxShadow: "-8px 7px 71px 25px rgba(0,0,0,0.1)",
                                            transition: "box-shadow 0.3s ease-in-out", // Adding transition for smooth effect
                                            ":hover": {
                                                boxShadow: "-8px 7px 71px 40px rgba(0,0,0,0.2)", // Adjusting box-shadow on hover
                                            }
                                        }}
                                            className='w-[30%] min-h-[145px] relative rounded-xl text-black p-4 text-xl font-semibold flex flex-col gap-2 cursor-pointer'>
                                            <div className='w-full'>
                                                {task.title}
                                                <p className='text-base font-medium opacity-50'>{task.desc}</p>
                                            </div>
                                            {task.isAdminGenerated ? (
                                                <div className='absolute bottom-0 left-0'>
                                                    <Tooltip arrow title="These are admin generated tasks. Failing to do these tasks will lead to decrease in your avatars health!">
                                                        <IconButton>
                                                            <InfoOutlinedIcon className='!text-3xl text-cobalt' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>) :
                                                (<div className='absolute bottom-0 left-0'>
                                                    <Tooltip arrow title="Delete this task">
                                                        <IconButton onClick={() => handleDelete(task)}>
                                                            <DeleteIcon className='!text-3xl text-d-red' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>)}
                                            <div className='absolute top-[-35px] right-0'>
                                                <Checkbox
                                                    onClick={() => (updateTask(task))}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }}
                                                />
                                            </div>
                                            <div className='absolute bottom-4 right-4 !text-sm flex items-center justify-center gap-1 opacity-60'>
                                                <span><CalendarMonthIcon className='!text-[22px]' /></span>
                                                <span>{formatDate(task.date)}</span>
                                            </div>
                                        </div>)
                                })}
                            </div>) : (
                                <div className='w-full text-center mt-8 font-semibold text-lg'>
                                    No Pending Financial Habits Yet :)
                                </div>
                            )}
                    </div>
                    {open && (
                        <AddTaskModal open={open} handleClose={handleClose} user={user} setChange={setChange} change={change} />
                    )}
                    <div className='w-full max-h-1/2'>
                        <div className='w-full p-2 text-2xl font-bold tracking-wide flex items-center'>
                            Completed Financial Habits
                        </div>
                        {completed.length > 0 ? (<div className='mt-4 p-2 w-full h-[70%] overscroll-y-auto flex flex-wrap items-start justify-start gap-8'>
                            {completed.map((task) => {

                                return (
                                    <div style={{
                                        boxShadow: "-8px 7px 71px 25px rgba(0,0,0,0.1)"
                                    }}
                                        className='w-[30%] min-h-[145px] relative rounded-xl text-black p-4 text-xl font-semibold flex flex-col gap-2'>
                                        <div className='w-full'>
                                            {task.title}
                                            <p className='text-base font-medium opacity-50'>{task.desc}</p>
                                        </div>
                                        {task.isAdminGenerated ? (
                                            <div className='absolute bottom-0 left-0'>
                                                <Tooltip arrow title="These are admin generated tasks. Failing to do these tasks will lead to decrease in your avatars health!">
                                                    <IconButton>
                                                        <InfoOutlinedIcon className='!text-3xl text-cobalt' />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>) :
                                            (<div className='absolute bottom-0 left-0'>
                                                <Tooltip arrow title="Delete this task">
                                                    <IconButton onClick={() => handleDelete(task)}>
                                                        <DeleteIcon className='!text-3xl text-d-red' />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>)}
                                        <div className='absolute top-[-35px] right-0'>
                                            <Checkbox
                                                onClick={() => (updateTask(task))}
                                                checked
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }}
                                            />
                                        </div>
                                        <div className='absolute bottom-4 right-4 !text-sm flex items-center justify-center gap-1 opacity-60'>
                                            <span><CalendarMonthIcon className='!text-[22px]' /></span>
                                            <span>{formatDate(task.date)}</span>
                                        </div>
                                    </div>)
                            })}
                        </div>) : (
                            <div className='w-full text-center mt-8 font-semibold text-lg'>
                                No Completed Financial Habits Yet :(
                            </div>
                        )}
                    </div>
                </div>)}
        </Center>
    );
};

export default TaskPages;