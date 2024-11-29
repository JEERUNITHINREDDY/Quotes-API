const express = require('express');
const axios = require('axios');
const path = require('path');
const https = require('https');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.get('https://api.quotable.io/random', { httpsAgent: agent });
    const quoteData = response.data;

    res.render('home', { quote: quoteData.content, author: quoteData.author });
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).render('error', { message: 'Could not fetch a quote. Please try again later.' });
  }
});

app.post('/post', (req, res) => {
  const { quote, author } = req.body;

  res.render('post', { quote, author });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
