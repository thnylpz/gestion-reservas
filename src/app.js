const express = require('express');
const app = express();

app.use(express.json());

let reservas = [];

app.get('/reservas', (req, res) => {
  res.status(200).json(reservas);
});

app.post('/reservas', (req, res) => {
  const { cliente, fecha } = req.body;

  const existe = reservas.find(r => r.fecha === fecha);

  if (existe) {
    return res.status(400).json({ error: "Fecha no disponible" });
  }

  const nuevaReserva = { cliente, fecha };
  reservas.push(nuevaReserva);

  res.status(201).json(nuevaReserva);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: "UP" });
});

module.exports = app;
