import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import { Alert } from '@material-ui/lab';
import { TramRounded } from '@material-ui/icons';

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
  rows: {
    style: {
      // override the row height
    },
  },
  headCells: {
    style: {
      // override the cell padding for head cells
      fontWeight: 600,
      fontSize: '16px',
      textTransform: 'capitalize',
    },
  },
  cells: {
    style: {
      // override the cell padding for data cells
    },
  },
};

const useStyles = makeStyles((theme) =>
  createStyles({
    document: {},
    searchInputDiv: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    searchInput: {
      float: 'right',
      fontSize: '16px',
      outline: 'none',
      width: '100%',
      padding: theme.spacing(1.5),
      '&:focus': {
        color: '#5e6278',
      },
    },
    deleteButton: {
      background: 'red',
      border: '1px solid #E4E9EA',
      boxSizing: 'border-box',
      borderRadius: '6px',
      width: '50px',
      fontWeight: 500,
      fontSize: '12px',
      color: theme.palette.background.paper,
      padding: theme.spacing(1.5),
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    fileIcon: {
      fontSize: '50px',
    },
    root: {
      cursor: 'pointer',
      marginBottom: '30px',
      minWidth: 200,
      maxWidth: 265,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 20,
      color: theme.palette.primary.dark,
    },
    pos: {
      marginBottom: 12,
    },
  })
);

const Documents = () => {
  const classes = useStyles();
  const [documents, setDocuments] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [fileData, setFileData] = React.useState([]);
  const [tableTitle, setTableTitle] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertType, setAlertType] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  React.useEffect(() => {
    GetFiles();
  }, []);

  const GetFiles = async () => {
    const response = await fetch('/api/getDocuments');
    const resultData = await response.json();
    setDocuments(resultData);
  };

  const GetSpreedSheetData = async () => {
    const res = await fetch('/api/updateSheet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setLoading(true);
    const resultDataFromGoogle = await res.json();
    console.log(resultDataFromGoogle);
    if (resultDataFromGoogle) {
      setLoading(false);
      setAlertType('success');
      setShowAlert(true);
      setAlertMessage('Check Console for result');
    } else {
      setAlertType('info');
      setLoading(false);
      setShowAlert(true);
      setAlertMessage('Something unexpected happen !');
    }
  };

  const handleOnClickFile = (arr, fileName) => {
    const singleRow = arr[0];
    const cols = Object.keys(singleRow).map((e) => {
      return { name: e, selector: e };
    });
    setColumns(cols);
    setData(arr);
    setTableTitle(fileName);
  };

  // delete File
  const DeleteFile = async (id) => {
    const documentId = id;
    const response = await fetch('/api/deleteDocument', {
      method: 'DELETE',
      body: JSON.stringify({ documentId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resultData = await response.json();
    if (resultData?.status === true) {
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('File Deleted');
      setData([]);
      setFileData([]);
      setColumns([]);
      setTableTitle('');
      GetFiles();
    }
    console.log({ resultData });
  };

  return (
    <div>
      <h3>All Documents List</h3>
      <br />

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Button
        color="primary"
        variant="contained"
        onClick={() => GetSpreedSheetData()}
        disabled={loading}
      >
        Update Spread Sheet Data
      </Button>

      <br />
      <br />
      <br />

      {documents?.length > 0 && (
        <Grid container className={classes.document}>
          {documents?.map((d) => {
            return (
              <Grid key={d._id} item xs={4}>
                <Card className={classes.root}>
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {d.fileName}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Time: {new Date(`${d.createdAt}`).toLocaleTimeString()}
                      <br />
                      Date: {d.createdAt.split('T')[0]}
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <DescriptionTwoToneIcon className={classes.fileIcon} />
                    </div>
                  </CardContent>
                  <CardActions>
                    <div className={classes.actionButtons}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleOnClickFile(d?.document, d?.fileName)
                        }
                      >
                        Show Data
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          // handleOnClickFile(d?.document, d?.fileName)
                          DeleteFile(d?._id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <br />
      <br />
      <DataTable
        fixedHeader={true}
        fixedHeaderScrollHeight="500px"
        title={tableTitle}
        pagination
        highlightOnHover
        responsive={true}
        customStyles={customStyles}
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default Documents;
