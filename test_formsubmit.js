const https = require('https');

const data = JSON.stringify({
  _subject: '🏎️ تجربة فورية - AutoVroom Quiz Results',
  name: 'مهندس أنس (تجربة إرسال)',
  email: 'mn8665967@gmail.com',
  _captcha: 'false',
  _template: 'table',
  message: 'مرحباً بك! هذه رسالة تجريبية لتأكيد وصول إجابات اختبار AutoVroom إلى إيميلك بنجاح.'
});

const options = {
  hostname: 'formsubmit.co',
  port: 443,
  path: '/ajax/mn8665967@gmail.com',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://aoutovroom.vercel.app',
    'Referer': 'https://aoutovroom.vercel.app/',
    'Content-Length': Buffer.byteLength(data),
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();
