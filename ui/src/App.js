import ClearIcon from '@mui/icons-material/Backspace';
import HistoryIcon from '@mui/icons-material/History';
import ExportIcon from '@mui/icons-material/SaveAlt';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import Alert from './Alert';
import CsvGrid from './CsvGrid';
import ExpressionField from './ExpressionField';
import Results from './Results';

const API_URL = process.env.API_URL;

function App() {
    const [results, setResults] = React.useState([]);
    const [resultsVisible, setResultsVisible] = React.useState(true);
    const expressionFieldRef = React.useRef();
    const alertRef = React.useRef();
    const csvGridRef = React.useRef();

    const handleButtonClick = (value) => {
        expressionFieldRef.current.push(value);
    };

    const handleCalculate = () => {
        const data = {
            expression: expressionFieldRef.current.expression()
        };
        axios.post(`${API_URL}/calculate`, data)
            .then(response => {
                setResults(prev => [...prev, response.data]);
                alertRef.current.info(response.data.result);
                alertRef.current.open();
                expressionFieldRef.current.clear();
            })
            .catch(error => {
                console.log(error);
                alertRef.current.error(error.response.data.detail);
                alertRef.current.open();
            });
    };

    const handleClear = () => {
        axios.delete(`${API_URL}/clear`)
            .then(_ => {
                expressionFieldRef.current.clear();
                setResults([]);
                alertRef.current.success('Cleared');
                alertRef.current.open();
            })
            .catch(error => {
                console.log(error);
                alertRef.current.error(error.response.data.detail);
                alertRef.current.open();
            });
    };

    const handleBackspace = () => {
        expressionFieldRef.current.pop();
    };

    const handleExport = () => {
        const options = {
            responseType: 'blob'
        }
        axios.get(`${API_URL}/export`, options)
            .then(response => {
                let contentDisposition = response.headers['content-disposition'];
                let filename = contentDisposition.split('filename=')[1];
                let data = response.data;
                csvGridRef.current.open(filename, data);
                alertRef.current.close();
            })
            .catch(error => {
                console.log(error);
                alertRef.current.error(error.response.data.detail);
                alertRef.current.open();
            });
    };

    return (
        <Box display="flex" flexDirection="column" marginX={5} marginY={5} sx={{ height: '100vh' }}>

            <CsvGrid ref={csvGridRef} />

            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    marginTop: '1rem',
                }}
            >
                RPN Calculator
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    height: '100%', flex: 1, flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}>
                <Grid container spacing={2} sx={{ flex: 3, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid size={12}>
                        <Alert ref={alertRef} />
                    </Grid>

                    <Grid size={12}>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <ExpressionField ref={expressionFieldRef} />
                                </Grid>
                                <Grid size={3}>
                                    <IconButton
                                        aria-label="clear"
                                        fullWidth
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 0,
                                        }}
                                        onClick={handleBackspace}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Grid>
                                <Grid size={3}>
                                    <IconButton
                                        aria-label="history"
                                        fullWidth
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 0,
                                        }}
                                        onClick={() => {
                                            setResultsVisible(!resultsVisible);
                                        }}
                                    >
                                        <HistoryIcon />
                                    </IconButton>
                                </Grid>

                                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((item, index) => (
                                    <Grid size={3} key={index}>
                                        <Button
                                            variant="text"
                                            fullWidth
                                            color={item === '=' ? 'secondary' : 'primary'}
                                            onClick={() => {
                                                if (item === '=') {
                                                    handleCalculate();
                                                } else {
                                                    handleButtonClick(item.toString());
                                                }
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem',
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {item}
                                        </Button>
                                    </Grid>
                                ))}

                                <Grid size={9}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ExportIcon />}
                                        fullWidth
                                        onClick={handleExport}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        Export
                                    </Button>
                                </Grid>

                                <Grid size={3}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={handleClear}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        C
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {resultsVisible && (
                    <Box sx={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }} >
                        <Results
                            stack={results}
                            onNumberClick={(number) => {
                                expressionFieldRef.current.push(number.toString());
                            }
                            }
                            onPushExpression={(expression) => {
                                expressionFieldRef.current.push(expression);
                            }}
                            onCopyExpression={(expr) => {
                                navigator.clipboard.writeText(expr);
                            }} />
                    </Box>
                )
                }

            </Stack >
        </Box >
    );
}

export default App;
