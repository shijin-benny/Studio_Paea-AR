import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { email, firstName, lastName, message } = body;

    // Validation
    if (!email || !firstName || !lastName || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Google Sheets API integration
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const SHEET_NAME = process.env.GOOGLE_SHEETS_NAME || 'Sheet1';
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!SPREADSHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google Sheets configuration');
      // For development, you can return success even without Google Sheets
      // In production, you should handle this error properly
      return NextResponse.json(
        { 
          success: true, 
          message: 'Form submitted successfully (Google Sheets not configured)' 
        },
        { status: 200 }
      );
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      email,
      firstName,
      lastName,
      message,
    ];

    // Use Google Sheets API v4
    const { google } = require('googleapis');
    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // Append data to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
