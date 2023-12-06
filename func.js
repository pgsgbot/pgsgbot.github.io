function init() {
    gapi.load('client', start);
}

function start() {
    // Load client secrets from your "client_secret.json" file
    fetch('client_secret.json')
        .then(response => response.json())
        .then(credentials => {
            // Call the authorize function with the obtained credentials
            authorize(credentials, getCellValue);
        });
}

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;

    // Initialize the Google API client with the given credentials
    gapi.client.init({
        clientId: client_id,
        apiKey: "AIzaSyAHu7367OQzogo_McZ2axdQ3sU4Y0IOV6Y",
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest"],
        scope: 'https://www.googleapis.com/auth/spreadsheets',
    }).then(() => {
        // Check if the user is already signed in
        const authInstance = gapi.auth2.getAuthInstance();

        if (authInstance.isSignedIn.get()) {
            // User is signed in, call the callback with the authenticated instance
            callback(authInstance);
        } else {
            // User is not signed in, initiate the sign-in process
            authInstance.signIn().then(() => {
                // Call the callback with the authenticated instance
                callback(authInstance);
            });
        }
    });
}
 

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Display the authorization URL to the user
    console.log('Authorize this app by visiting this url:', authUrl);

    // Prompt the user to enter the authorization code
    const code = prompt('Enter the code from the authorization page:');

    oAuth2Client.getToken(code).then(response => {
        oAuth2Client.setCredentials(response.tokens);
        // Store the token to localStorage for later program executions
        localStorage.setItem('token', JSON.stringify(response.tokens));
        callback(oAuth2Client);
    });
}

function getCellValue(auth) {
    const sheets = gapi.client.sheets({ version: 'v4', auth });
    const spreadsheetId = '1CPBUjKMlbRRNy7OBGUBChJnEkLjPCXHKtY2J6-dLn8Q';

    sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1',
    }).then(response => {
        const value = response.result.values[0][0];
        document.getElementById('sheetData').innerText = `Value in A1: ${value}`;
    });
}
