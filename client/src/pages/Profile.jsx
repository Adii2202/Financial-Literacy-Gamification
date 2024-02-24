import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Tooltip, CircularProgress, Button, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { togglePfp } from '../redux/features/pfpslice';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { avatarData } from '../data/avatarData';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Center from '../animated-components/Center';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Api from '../api';
import AvatarComp from '../components/avatar/AvatarComp';
import Tabs from '../components/profile/Tabs';

function Profile() {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    pfp: '',
    name: '',
    bio: '',
    email: userInfo.email,
  });
  const [uploadedPfp, setUploadedPfp] = useState(null);
  const userPfp = useSelector(state => state.pfp.userPfp);
  const userProf = useSelector(state => state.pfp.userProf);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState();
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchUser = async () => {
      await Api.getUser({ email: userInfo.email })
        .then((res) => {
          console.log('User:', res.data);
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    };
    fetchUser();
  }, [changed, userProf]);

  const handleRemovePfpClick = () => {
    setEditedInfo({
      ...editedInfo,
      pfp: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Remove the pfp
    });
    setUploadedPfp('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  };

  const handleEditClick = () => {
    // Initialize editedInfo with current user info
    setEditedInfo({
      pfp: user.pfp ? user.pfp : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Set the current pfp URL
      name: user.name,
      bio: user.bio,
      email: user.email,
    });
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setUploadedPfp(null);
    setIsEditMode(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageUpload = (acceptedFiles) => {
    if (!isEditMode) return;
    const selectedFile = acceptedFiles[0];
    convertToBase64(selectedFile)
      .then((base64Image) => {
        setUploadedPfp(base64Image);
        setEditedInfo({
          ...editedInfo,
          pfp: base64Image, // Save the selected file as base64
        });
      })
      .catch((error) => {
        console.error('Error converting image to base64:', error);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: handleImageUpload,
    // maxSize: 5242880, // 5MB
  });

  const handleSaveClick = async () => {
    if (editedInfo.name === '') {
      toast.error('Name cannot be empty!');
      return;
    }
    // console.log('editedInfo:', editedInfo.pfp);
    await Api.editUser({ info: editedInfo })
      .then((res) => {
        console.log('User info updated:', res.data);
        const updateUser = {
          ...JSON.parse(localStorage.getItem('user')),
          name: editedInfo.name,
          pfp: editedInfo.pfp,
        };
        localStorage.setItem('user', JSON.stringify(updateUser));
        dispatch(togglePfp());
        setIsEditMode(false);
        setChanged(!changed);
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
      });
  }

  return (
    <Center>
      {loading ?
        (<div className='w-full h-screen flex items-center justify-center'>
          <CircularProgress />
        </div>)
        : (
        <div className='w-full h-full flex flex-col gap-4'>
          <div className='w-full flex items-start gap-4'>
            <div className='w-1/2 flex flex-col items-start gap-4 p-4'>
              <div className='text-3xl font-bold text-main-purp flex items-center'>
                Your Profile
                {!isEditMode ? (<span>
                  <IconButton onClick={handleEditClick}>
                    <ModeEditIcon />
                  </IconButton>
                </span>) :
                  (<div className='flex items-center gap-2 ml-8'>
                    <Button variant='contained' onClick={handleSaveClick}>
                      Save
                    </Button>
                    <Button color='error' variant='outlined' onClick={handleCancelClick}>
                      Cancel
                    </Button>
                  </div>)
                }
              </div>
              <div className='w-full flex items-center justify-start gap-4'>
                {isEditMode ? (
                  <div className='w-[30%] flex flex-col items-center justify-center gap-2'>
                    <div
                      {...getRootProps()}
                      className='profile-photo-container flex flex-col items-center justify-center'
                    >
                      <input {...getInputProps()} />
                      <img
                        className='profile-photo'
                        src={uploadedPfp || ((user.pfp) || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png')}
                        alt='profile'
                        // width='0px'
                        style={{
                          borderRadius: '50%',
                          width: '175px',
                          height: '175px',
                        }}
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      {isEditMode && <span {...getRootProps()} className='text-blue text-xs text-center w-full dark:!text-pink cursor-pointer underline'>Change</span>}
                      {isEditMode && <span onClick={handleRemovePfpClick} className='text-blue text-xs text-center w-full dark:!text-pink cursor-pointer underline'>Remove</span>}
                    </div>
                  </div>)
                  : (
                    <img
                      className='profile-photo w-[30%]'
                      src={(user.pfp) || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                      alt='profile'
                      width='100'
                      style={{
                        borderRadius: '50%',
                        width: '175px',
                        height: '175px',
                      }}
                    />
                  )}
                <div className='w-[60%] text-white dark:!text-black flex flex-col items-start justify-start gap-2'>
                  {!isEditMode ? (
                    <>
                      <div className='text-3xl tracking-wide font-bold'>
                        {user.name}
                      </div>
                      <div className='text-lg font-semibold tracking-wide'>
                        {user.title}
                      </div>
                      <div className='w-full break-words text-base tracking-wide'>
                        {user.bio}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-full flex flex-col items-center justify-start gap-8`}>
                        <TextField
                          label='Name'
                          variant='outlined'
                          fullWidth
                          value={editedInfo.name}
                          onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                        />
                        <TextField
                          label='Bio'
                          variant='outlined'
                          multiline
                          rows={3}
                          fullWidth
                          value={editedInfo.bio}
                          onChange={(e) => setEditedInfo({ ...editedInfo, bio: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className='w-1/2 flex flex-col items-start gap-4 p-4'>
              <AvatarComp image={user.gaming.avatar?.image} user={user} />
            </div>
          </div>
            <div>
              <Tabs user={user} />
            </div>
        </div>)}
    </Center>
  );
}

export default Profile;
