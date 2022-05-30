/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 *
 */
import { getCookie } from 'cookies-next';
export default async function handler(req, res) {
  const { google } = require('googleapis');

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];
  const APP_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://next-dashboard-app.vercel.app';

  const YOUR_REDIRECT_URL = `${APP_URL}/api/google/callback`;
  const tokens = getCookie('tokens', { req, res });

  // const auth = await google.auth.getClient();
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    YOUR_REDIRECT_URL
  );
  oauth2Client.setCredentials(JSON.parse(tokens));

  const service = google.sheets({ version: 'v4', auth: oauth2Client });

  // ---------------------------------------- //
  // ? -------For Getting Sheet Values
  // ---------------------------------------- //
  const getRows = async () => {
    const result = await service.spreadsheets.values.get({
      spreadsheetId: '1w6ObgR8LmdbfAE60zdTeZ3C_ejx_BEsXQkcXrijUeJo',
      range: 'Sheet1!A:C',
    });
    const numRows = result.data.values ? result.data.values : 0;
    console.log(`${numRows} rows retrieved.`);
    if (numRows) {
      res.status(201).json({ data: numRows });
    }
    return numRows;
  };

  // ---------------------------------------- //
  // ? -------For Updating Sheet Values
  // ---------------------------------------- //

  const updateSheet = async () => {
    try {
      const request = {
        // The ID of the spreadsheet to update.
        spreadsheetId: '1w6ObgR8LmdbfAE60zdTeZ3C_ejx_BEsXQkcXrijUeJo', // TODO: Update placeholder value.
        // The A1 notation of a range to search for a logical table of data.
        // Values are appended after the last row of the table.
        range: 'Sheet1!A21:C22', // TODO: Update placeholder value.
        // How the input data should be interpreted.
        valueInputOption: 'USER_ENTERED', // TODO: Update placeholder value.
        // How the input data should be inserted.
        insertDataOption: 'OVERWRITE', // TODO: Update placeholder value.  Options: "INSERT_ROWS", "OVERWRITE"
        // How the input data should be inserted.
        includeValuesInResponse: true, // TODO: Update placeholder value. Options: true, false
        resource: {
          // TODO: Add desired properties to the request body.
          values: [
            ['23', 'my test name 21', 'email@abc.com'],
            ['24', 'ukdgiuwgfuw 22', 'email@b.com'],
          ],
        },
      };
      const result = await service.spreadsheets.values.append(request);
      if (result === undefined) return res.status(501).json({ data: result });
      if (result?.data) {
        res.status(200).json({ data: result.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  try {
    // TODO Add Function to run
    // await getRows();
    await updateSheet();
  } catch (err) {
    console.log(err);
  }
}
