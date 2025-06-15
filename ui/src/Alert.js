import MuiAlert from '@mui/material/Alert';
import React, { forwardRef, useImperativeHandle } from "react";

const Alert = forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState('error');
    const [message, setMessage] = React.useState();
    const alertRef = React.useRef();

    useImperativeHandle(ref, () => ({
        open: () => {
            setOpen(true);
        },
        close: () => {
            setOpen(false);
        },
        info: (message) => {
            setSeverity('info');
            setMessage(message);
        },
        success: (message) => {
            setSeverity('success');
            setMessage(message);
        },
        error: (message) => {
            setSeverity('error');
            setMessage(message);
        },
    }));

    return (
        (open &&
            <MuiAlert
                ref={alertRef}
                variant="outlined"
                severity={severity}
            >
                {message}
            </MuiAlert>
        )
    );
});

export default Alert;