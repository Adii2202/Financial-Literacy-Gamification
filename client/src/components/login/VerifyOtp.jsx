import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Container
} from '@mui/material';
// import APIRequests from '../../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Api from '../../api';


export default function VerifyOtp({ open, handleClose, email, setLoginInfo}) {
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(pin)
        await Api.verifyOtp({email, otp:pin})
        .then(async (res) => {
            console.log(res.data);
            if (res.data.message == 'success') {
                toast.success("Logged in successfully!");
                handleClose();
                localStorage.setItem('token', res.data.token);
                const decodedToken = jwtDecode(res.data.token);
                // console.log(decodedToken);
                localStorage.setItem('user', JSON.stringify(decodedToken));
                setPin("");
                setLoginInfo({
                    email: '', 
                    password: ''
                })
                await timeout(1500);
                // navigate("/home");
                window.location.href = "/home";
            }
            else {
                toast.error(res.data.message);
            }
        })
    };

    return (
        <Dialog open={open} onClose={handleClose} sx={{
            '& .MuiDialog-paper': {
                backdropFilter: 'blur(15px)',
                backgroundColor: 'rgba(148, 245, 221, 0.1)', // Using rgba to give it a translucent effect
                borderRadius: '20px',   
                color: 'white',
            }
        }}>
            <DialogTitle>Verify your Email</DialogTitle>
            <DialogContent>
                <Container maxWidth="sm">
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" spacing={2}>
                        <Typography variant="body1">
                            We have sent a code to your email:
                        </Typography>
                        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                            {email}
                        </Typography>
                        <MuiOtpInput
                            value={pin}
                            onChange={setPin}
                            length={6}
                            variant="outlined"
                            TextFieldsProps={{ placeholder: '-' }}
                            color={'white'}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="outlined"
                            // color="primary"

                            onClick={handleSubmit}
                            sx={{ marginTop: 3,
                                color: 'white',
                                borderColor: 'white',
                                ":hover": {
                                    backgroundColor: 'white',
                                    color: 'black', 
                                }
                            }}
                        >
                            Verify
                        </Button>
                    </Box>
                </Container>
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
            </DialogActions> */}
        </Dialog>
    );
}
