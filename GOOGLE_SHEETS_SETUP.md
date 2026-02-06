# Google Sheets Integration Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `contact-form-service`
   - Click "Create and Continue"
   - Skip optional steps and click "Done"

## Step 3: Create and Download Service Account Key

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure!)

## Step 4: Create a Google Sheet

1. Create a new Google Sheet
2. Name it (e.g., "Contact Form Submissions")
3. Add headers in the first row:
   - Column A: `Timestamp`
   - Column B: `Email`
   - Column C: `First Name`
   - Column D: `Last Name`
   - Column E: `Message`

## Step 5: Share Sheet with Service Account

1. Click the "Share" button in your Google Sheet
2. Add the service account email (found in the JSON file as `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 6: Get Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. Copy the `YOUR_SHEET_ID` part

## Step 7: Set Environment Variables

Create a `.env.local` file in your project root with:

```env
GOOGLE_SHEETS_ID=your_sheet_id_here
GOOGLE_SHEETS_NAME=Sheet1
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Replace `your_sheet_id_here` with your actual Sheet ID
- Replace `Sheet1` with your sheet name if different
- Copy the `client_email` from the JSON file to `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Copy the `private_key` from the JSON file to `GOOGLE_PRIVATE_KEY` (keep the quotes and \n characters)
- Never commit `.env.local` to git!

## Step 8: Test the Form

1. Start your development server: `npm run dev`
2. Go to `/contact` page
3. Fill out and submit the form
4. Check your Google Sheet - the data should appear!

## Troubleshooting

- **"Missing Google Sheets configuration"**: Check your `.env.local` file
- **"Permission denied"**: Make sure you shared the sheet with the service account email
- **"Invalid credentials"**: Double-check your private key format (keep the \n characters)
