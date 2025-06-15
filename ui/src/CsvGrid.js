import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import { Button, Modal, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Papa from 'papaparse';
import React, { forwardRef, useImperativeHandle } from "react";

const CsvGrid = forwardRef((props, ref) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        height: '75%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const [filename, setFilename] = React.useState();
    const [data, setData] = React.useState();
    const [rows, setRows] = React.useState([]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            editable: false,
            flex: 1
        },
        {
            field: 'expression',
            headerName: 'Expression',
            editable: false,
            flex: 3
        },
        {
            field: 'result',
            headerName: 'Result',
            editable: false,
            flex: 3
        },
        {
            field: 'timestamp',
            headerName: 'Timestamp',
            editable: false,
            flex: 3
        },
    ];

    useImperativeHandle(ref, () => ({
        open: (filename, data) => {
            setFilename(filename);
            setData(data);
            Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    setRows(results.data.map((row, index) => ({ ...row, id: index })));
                    setOpen(true);
                },
                error: function (err) {
                    console.error('Erreur parsing CSV:', err);
                }
            });
        },
        close: () => {
            setOpen(false);
        },
        download: () => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    }));

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack direction="column" spacing={2} sx={{ height: '100%' }}>
                    <Stack direction="row-reverse" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CloseIcon />}
                            onClick={() => ref.current.close()}>
                            Close
                        </Button>
                        <Button
                            disabled={rows.length === 0}
                            variant="outlined"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={() => ref.current.download()}>
                            Download
                        </Button>
                    </Stack>
                    <Box sx={{ flex: 1, minHeight: 0, height: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}

                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 20,
                                    },
                                },
                            }}
                            pageSizeOptions={[20]}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
});

export default CsvGrid;