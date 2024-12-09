const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/call', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});