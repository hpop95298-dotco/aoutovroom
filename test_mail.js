const https = require('https');

const data = JSON.stringify({
  access_key: '0c494a24-4a78-40b5-b227-5281a6331bb7',
  subject: '🏎️ تجربة فورية - AutoVroom Quiz',
  from_name: 'AutoVroom Test',
  name: 'مهندس أنس (تجربة إرسال)',
  email: 'mn8665967@gmail.com',
  message: 'مرحباً بك! هذه رسالة تجريبية لتأكيد وصول إجابات اختبار AutoVroom إلى إيميلك بنجاح.'
});

const options = {
  hostname: 'api.web3forms.com',
  port: 443,
  path: '/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
