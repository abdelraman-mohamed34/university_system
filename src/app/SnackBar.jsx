'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSnackbar } from './features/NormalSlices/snackSlice';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';

const CustomAlert = styled(MuiAlert)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    color: '#4D44B5',
    borderRadius: '5px',
    fontSize: '16px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 0,
    textAlign: 'center',
}));

export default function SnackBar() {
    const dispatch = useDispatch();
    const showSnackbar = useSelector(s => s.snackbar.showSnackbar);

    const handleClose = () => {
        dispatch(setShowSnackbar({ state: false, message: '' }));
    };

    const action = (
        <Button
            size="small"
            onClick={handleClose}
            sx={{
                minWidth: 'auto',
                padding: '4px',
                color: '#4D44B5',
            }}
            aria-label="close"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </Button>
    );

    return (
        <Snackbar
            open={showSnackbar?.state}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <CustomAlert
                onClose={handleClose}
                action={action}
                severity={showSnackbar?.severity || 'info'}
            >
                {showSnackbar?.message}
            </CustomAlert>
        </Snackbar>
    );
}
