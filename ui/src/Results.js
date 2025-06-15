import { Box, Paper, Stack, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import Result from "./Result";

const Results = forwardRef((props, ref) => {
    const stackMaxLength = 4;
    const [open, setOpen] = React.useState(true);
    const [stack, setStack] = React.useState([]);

    const {
        onNumberClick,
        onPushExpression,
        onCopyExpression,
    } = props;

    useEffect(() => {
        setStack(props.stack);
    }, [props.stack]);

    useImperativeHandle(ref, () => ({
        toggle: () => {
            setOpen(!open);
        },
        isVisible: () => {
            setOpen(!open);
        },
        push: (result) => {
            if (stack.length === stackMaxLength) {
                setStack(prev => prev.slice(1));
            }
            setStack(prev => [...prev, result]);
        },
        clear: () => {
            setStack([]);
        }
    }));

    return (
        (open &&
            <Box maxWidth="sm" sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Paper
                    variant="outlined"
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}>
                    {stack.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: "auto",
                            height: '100%',
                        }}>
                            <Typography
                                variant="button"
                                color="textSecondary"
                                sx={{
                                    height: 'auto',
                                }}
                            >
                                No results yet
                            </Typography>
                        </Box>
                    ) : (
                        <Stack
                            spacing={1}
                            padding={2}
                            divider={<Divider />}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                overflowY: 'auto',
                            }}>
                            {stack.map((item, _) => (
                                <Result
                                    key={item.expression}
                                    expression={item.expression}
                                    result={item.result}
                                    timestamp={item.timestamp}
                                    onNumberClick={onNumberClick}
                                    onPushExpression={onPushExpression}
                                    onCopyExpression={onCopyExpression}
                                />
                            ))}
                        </Stack>
                    )}
                </Paper>
            </Box>
        )
    );
});

export default Results;