import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import { Button, TextField, Typography, Snackbar } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';

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
    addFileBtn: {
      background: '#FFFFFF',
      border: '1px solid #E4E9EA',
      boxSizing: 'border-box',
      borderRadius: '6px',
      width: '50px',
      fontWeight: 500,
      fontSize: '12px',
      color: theme.palette.secondary.dark,
      padding: theme.spacing(1.5),
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 30px',
    },
  })
);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminPannel = () => {
  const classes = useStyles();
  const [columns, setColumns] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [fileData, setFileData] = React.useState([]);
  const [tableTitle, setTableTitle] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  // seach query function
  const SearchData = (e) => {
    const searchedValue = e.target.value;
    if (searchedValue === '') return setData(fileData);
    const filterPosts = data.filter((v) =>
      v?.email?.toLowerCase().includes(searchedValue)
    );
    setData(filterPosts);
  };

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    console.log({ columns });

    setData(list);
    setFileData(list);
    console.log(list);
    setColumns(columns);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setTableTitle(file?.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log({ fromCSV: data });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  // Save File to MongoDB
  const SaveFile = async () => {
    const document = fileData;
    const fileName = tableTitle.toString();
    const response = await fetch('/api/createDocument', {
      method: 'POST',
      body: JSON.stringify({ document, fileName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resultData = await response.json();
    if (resultData?.status === 200) {
      setShowAlert(true);
      setAlertMessage('File Uploaded');
      setData([]);
      setFileData([]);
      setColumns([]);
      setTableTitle('');
    }
    console.log({ resultData });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {alertMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h4">Upload Your CSV file to see data</Typography>
      <br />
      <div className={classes.actionButtons}>
        <div>
          <input
            type="file"
            style={{ display: 'none' }}
            id="raised-button-file"
            accept=".csv,.xlsx,.xls"
            multiple={false}
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            color="default"
            startIcon={<PublishIcon />}
          >
            <label style={{ cursor: 'pointer' }} htmlFor="raised-button-file">
              <Typography>Upload File</Typography>
            </label>
          </Button>
        </div>
        <div>
          <Button
            disabled={data?.length === 0}
            variant="contained"
            color="primary"
            onClick={SaveFile}
            startIcon={<SaveIcon />}
          >
            <Typography>Save File</Typography>
          </Button>
        </div>
      </div>

      <div className={classes.searchInputDiv}>
        <TextField
          name="search"
          disabled={data?.length === 0}
          className={classes.searchInput}
          type="text"
          variant="outlined"
          onChange={SearchData}
          placeholder="Search"
        />
      </div>
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

export default AdminPannel;
