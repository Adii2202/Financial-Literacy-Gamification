import React from 'react';
import { Tooltip, IconButton } from '@mui/material';

const Bar = ({ name, icon, value, maxValue, desc, barstyle }) => {
    return (
        <div className='w-full flex items-start justify-start'>
            <Tooltip arrow title={desc}>
                <IconButton>
                    {/* <FavoriteIcon className='text-red' /> */}
                    {icon}
                </IconButton>
            </Tooltip>
            <div className='w-full flex flex-col items-start gap-1'>
                <div className='w-full h-3 rounded-full flex items-center bg-slate'>
                    <div
                        className={`h-full rounded-l-full ${value == maxValue && "rounded-r-full"} ${barstyle}`}
                        style={{
                            width: `${(value/maxValue)*100}%`,
                            transition: 'width 0.5s ease-in-out'
                        }}
                    >
                    </div>
                </div>
                <div className='w-full flex items-start justify-between'>
                    <span className="text-sm text-black font-semibold tracking-wide">{value}/{maxValue}</span>
                    <span className="text-sm text-black font-semibold tracking-wide">{name}</span>
                </div>
            </div>
        </div>
    );
};

export default Bar;