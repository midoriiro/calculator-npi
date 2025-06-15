import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputIcon from '@mui/icons-material/Input';
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from "react";
import { format } from 'timeago.js';

dayjs.extend(utc);
dayjs.extend(timezone);

function Result({ expression, result, timestamp, onNumberClick, onPushExpression, onCopyExpression }) {
    const tokens = expression.split(' ').filter(token => token !== '');

    const isNumber = (token) => /^-?\d+(\.\d+)?$/.test(token);

    const browserTimezone = dayjs.tz.guess();

    const [relativeTime, setRelativeTime] = useState(format(dayjs.utc(timestamp).tz(browserTimezone).toDate()));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRelativeTime(format(dayjs.utc(timestamp).tz(browserTimezone).toDate()));
        }, 5000);

        return () => clearInterval(intervalId);
    }, [timestamp]);

    return (
        <Stack
            direction="column"
            spacing={1}
            padding={1}
            sx={{
                position: 'relative',
            }}
        >
            <Stack
                direction="row"
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: 'wrap',
                    rowGap: 1,
                    columnGap: 1,
                }}
            >
                <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    disableElevation
                    onClick={() => onNumberClick(result)}
                    sx={{
                        minWidth: '36px',
                        paddingX: 1,
                    }}
                >
                    {result}
                </Button>
                <Typography
                    variant="button"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        mx: 1,
                    }}
                >
                    =
                </Typography>
                {tokens.map((token, index) =>
                    isNumber(token) ? (
                        <Button
                            key={index}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            disableElevation
                            onClick={() => onNumberClick(token)}
                            sx={{
                                minWidth: '36px',
                                paddingX: 1,
                            }}
                        >
                            {token}
                        </Button>
                    ) : (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '36px',
                                minHeight: '32px',
                                paddingX: 1,
                                fontWeight: 'bold',
                                color: 'text.secondary',
                                cursor: 'default',
                                userSelect: 'none',
                            }}
                        >
                            {token}
                        </Box>
                    )
                )}
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        userSelect: 'none',
                        flexGrow: 1,
                    }}
                >
                    {relativeTime}
                </Box>
                <IconButton
                    size="small"
                    onClick={() => onPushExpression(expression)}
                >
                    <InputIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onCopyExpression(expression)}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Stack>
    );
}

export default Result;
