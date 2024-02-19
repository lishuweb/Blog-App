// const express = require("express");
import express from 'express';
const app = express();
import userRoutes from './routes/index';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.get('/ping', (_req, res) => {
//     res.send('pong');
// });

app.use('/', userRoutes);
  
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});