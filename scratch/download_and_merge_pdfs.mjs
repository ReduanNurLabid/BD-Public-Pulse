import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const items = [
  { id: 1, title: '01_বইয়ের_কভার', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/789af48b73ae4bafa2807b3a7649b219.pdf' },
  { id: 2, title: '02_প্রথম_পাতা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/78731fcfc69b41f5b67535724390abbf.pdf' },
  { id: 3, title: '03_মুখবন্ধ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/28e0e89ed2e84dc787d192ce0b6c5869.pdf' },
  { id: 4, title: '04_অবতরণিকা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/ec1fa88f5bf04796a51394a117a3256b.pdf' },
  { id: 5, title: '05_সূচিপত্র', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/46c8a7b646534e5da2afc5b234c3e375.pdf' },
  { id: 6, title: '06_সারণি_তালিকা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/a7d9de7dcd80407d921ce01b41e22e45.pdf' },
  { id: 7, title: '07_লেখচিত্র_তালিকা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/1cbaed8151c84638b05af9a08dbb17b9.pdf' },
  { id: 8, title: '08_সংযোজনী_তালিকা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/67552ef6e4684f0fac7bdc89a3e589a0.pdf' },
  { id: 9, title: '09_পরিসংখ্যান_সংক্ষেপ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/e84bf31d327e4bc4b11f49e66f8350a5.pdf' },
  { id: 10, title: '10_বাংলাদেশের_আর্থ-সামাজিক_নির্দেশকসমূহ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/db2abc939dbf4430a74edf73da8f7c3f.pdf' },
  { id: 11, title: '11_নির্বাহী_সার-সংক্ষেপ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/2465b2d98008418998fada5df081a836.pdf' },
  { id: 12, title: '12_১ম_অধ্যায়_সামষ্টিক_অর্থনৈতিক_পরিস্থিতি', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/4421dcf46efd4d609cbd00f238df5cbc.pdf' },
  { id: 13, title: '13_২য়_অধ্যায়_দেশজ_উৎপাদ_সঞ্চয়_ও_বিনিয়োগ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/4e6e8acf7bd647ab981e1b1ceb659fd0.pdf' },
  { id: 14, title: '14_৩য়_অধ্যায়_মূল্য_মজুরি_ও_কর্মসংস্থান', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/ac23b368432141cfaa431a575e50fb22.pdf' },
  { id: 15, title: '15_৪র্থ_অধ্যায়_রাজস্ব_নীতি_ও_ব্যবস্থাপনা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/ec8e8b6d50804feaa89e80cc102f6852.pdf' },
  { id: 16, title: '16_৫ম_অধ্যায়_মুদ্রা_ব্যবস্থাপনা_এবং_আর্থিক_বাজার_উন্নয়ন', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/870248f876bf405dbda9a30403774fff.pdf' },
  { id: 17, title: '17_৬ষ্ঠ_অধ্যায়_বহিঃ_খাত', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/b0d81833c5044faabe554483c236f474.pdf' },
  { id: 18, title: '18_৭ম_অধ্যায়_কৃষি', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2025/11/a78cf5b3-b436-4ef4-b263-2d9522131ec0.pdf' },
  { id: 19, title: '19_৮ম_অধ্যায়_শিল্প', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/d28fc7cdf8eb434db4892149939723bf.pdf' },
  { id: 20, title: '20_৯ম_অধ্যায়_স্ব-শাসিত_স্বায়ত্তশাসিত_ও_সংবিধিবদ্ধ_প্রতিষ্ঠান', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/d95c29420fe94bab91b9850f283c0289.pdf' },
  { id: 21, title: '21_১০ম_অধ্যায়_বিদ্যুৎ_ও_জ্বালানি', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/84b703dfe5814a119d97d8fa41d27105.pdf' },
  { id: 22, title: '22_১১শ_অধ্যায়_পরিবহণ_ও_যোগাযোগ', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/e0d9349522694950ad304df8ad55e2e0.pdf' },
  { id: 23, title: '23_১২শ_অধ্যায়_মানবসম্পদ_উন্নয়ন', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/8bec0b2776224d1da8c2321d81d212c2.pdf' },
  { id: 24, title: '24_১৩শ_অধ্যায়_দারিদ্র্য_বিমোচন', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2025/11/00395ab7-a303-4881-9125-0a7fe4617bca.pdf' },
  { id: 25, title: '25_১৪শ_অধ্যায়_বেসরকারি_খাত_উন্নয়ন', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/5279123ee16e4aab8356e4712f9c6558.pdf' },
  { id: 26, title: '26_১৫শ_অধ্যায়_পরিবেশ_জলবায়ু_পরিবর্তন_ও_উন্নয়ন', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/dadc6254d47c4625bc095090c9b21cfb.pdf' },
  { id: 27, title: '27_পরিসংখ্যান_পরিশিষ্ট', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/a433c73d20974ac79813f953b8435a01.pdf' },
  { id: 28, title: '28_সমীক্ষা_প্রণয়নে_নিয়োজিত_কর্মকর্তাগনের_তালিকা', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/df30aeac49c046648ef62a5e0bf19c23.pdf' },
  { id: 29, title: '29_ব্যাক_কভার', url: 'https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-mof/2024/12/4a477a9c5c614401ad122da51002cce9.pdf' },
];

const downloadDir = path.resolve('C:/Users/Reduan/Downloads/Bangladesh_Economic_Review_2024_Parts');
const mergedPdfPath = path.resolve('C:/Users/Reduan/Downloads/Bangladesh_Economic_Review_2024_Complete.pdf');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    const header = Buffer.alloc(4);
    const fd = fs.openSync(destPath, 'r');
    fs.readSync(fd, header, 0, 4, 0);
    fs.closeSync(fd);
    if (header.toString('utf-8') === '%PDF') {
      console.log(`[Cache Hit] Already downloaded: ${path.basename(destPath)}`);
      return;
    }
  }

  console.log(`[Downloading] ${path.basename(destPath)} from ${url}...`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length < 100 || !buffer.subarray(0, 4).toString('utf-8').includes('%PDF')) {
        throw new Error('Downloaded file does not start with %PDF header');
      }
      fs.writeFileSync(destPath, buffer);
      console.log(`[Success] Saved ${path.basename(destPath)} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed for ${url}: ${err.message}`);
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  console.log(`Starting download of ${items.length} PDF sections...`);
  const downloadedFiles = [];

  for (const item of items) {
    const fileName = `${String(item.id).padStart(2, '0')}_${item.title}.pdf`;
    const destPath = path.join(downloadDir, fileName);
    await downloadFile(item.url, destPath);
    downloadedFiles.push({ ...item, filePath: destPath });
  }

  console.log('\nAll downloads complete! Now merging PDFs...');
  const mergedPdf = await PDFDocument.create();
  let totalPages = 0;

  for (const item of downloadedFiles) {
    console.log(`Merging [${item.id}/29] ${item.title}...`);
    const fileBytes = fs.readFileSync(item.filePath);
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
    totalPages += copiedPages.length;
    console.log(`  -> Added ${copiedPages.length} pages (Total so far: ${totalPages})`);
  }

  console.log(`\nWriting combined PDF to: ${mergedPdfPath}...`);
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(mergedPdfPath, mergedPdfBytes);

  const finalSizeMb = (fs.statSync(mergedPdfPath).size / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 DONE!`);
  console.log(`- Final File: ${mergedPdfPath}`);
  console.log(`- Total Pages: ${totalPages}`);
  console.log(`- File Size: ${finalSizeMb} MB`);
}

run().catch(err => {
  console.error('Fatal error during download/merge:', err);
  process.exit(1);
});
