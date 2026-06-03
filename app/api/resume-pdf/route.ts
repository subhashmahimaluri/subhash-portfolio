import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getResumeData } from '../../../lib/data/resume-loader';
import { generateResumeHTML } from '../../../lib/utils/resumePdfGenerator';
import { Country } from '../../../types/resume';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ALLOWED_COUNTRIES = ['india', 'uae', 'germany', 'uk', 'eu'];

// Cap concurrent Chromium instances so a burst of requests can't OOM a small VPS.
const MAX_CONCURRENT = 2;
let inFlight = 0;

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') ?? 'uae').trim().toLowerCase();

  if (!ALLOWED_COUNTRIES.includes(country)) {
    return NextResponse.json({ error: 'Invalid country parameter' }, { status: 400 });
  }

  if (inFlight >= MAX_CONCURRENT) {
    return NextResponse.json(
      { error: 'Server busy generating PDFs, please retry shortly' },
      { status: 503, headers: { 'Retry-After': '5' } },
    );
  }

  inFlight += 1;
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    const resumeData = getResumeData(country as Country);
    const html = generateResumeHTML(resumeData, country as Country);

    browser = await puppeteer.launch({
      headless: true,
      // Use system Chromium in production (set via PUPPETEER_EXECUTABLE_PATH);
      // falls back to Puppeteer's bundled binary locally.
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 25000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });

    // Wrap in a fresh ArrayBuffer-backed Uint8Array so it satisfies BodyInit.
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Subhash_Mahimaluri_Resume_${country}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    inFlight -= 1;
  }
}
