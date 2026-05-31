import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getResumeData } from '../../../lib/data/resumeLoader';
import { generateResumeHTML } from '../../../lib/utils/resumePdfGenerator';
import { Country } from '../../../types/resume';

export const dynamic = 'force-dynamic';

const ALLOWED_COUNTRIES = ['india', 'uae', 'germany', 'uk', 'eu'];

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    let countryParam = searchParams.get('country');
    
    if (!countryParam) {
      countryParam = 'uae';
    }
    
    const country = countryParam.trim().toLowerCase();

    if (!ALLOWED_COUNTRIES.includes(country)) {
      return NextResponse.json({ error: 'Invalid country parameter' }, { status: 400 });
    }

    const resumeData = getResumeData(country as Country);
    const html = generateResumeHTML(resumeData, country as Country);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
      });

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Subhash_Mahimaluri_Resume_${country}.pdf"`,
          'Cache-Control': 'no-store'
        }
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
