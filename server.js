require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/config/database');

const casoRoutes = require('./src/routes/casoRoutes');
const viewRoutes = require('./src/routes/viewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRoutes);
app.use('/api/casos', casoRoutes);

app.listen(PORT, () => {
  console.log(`[Servidor] Rodando na porta ${PORT} -> http://localhost:${PORT}`);
});