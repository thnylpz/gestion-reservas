const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let reservas = [];
const startTime = Date.now();
const version = "1.0.0";

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

/* =========================
   API REST
========================= */

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

/* =========================
   DASHBOARD
========================= */

app.get('/dashboard', (req, res) => {

  const uptime = Math.floor((Date.now() - startTime) / 1000);

  res.send(`
    <html>
      <head>
        <title>Dashboard</title>
        <style>
          body { font-family: Arial; background:#f4f6f9; padding:30px; }
          .card { background:white; padding:20px; border-radius:8px; margin-bottom:15px; }
          a { text-decoration:none; color:blue; }
        </style>
      </head>
      <body>
        <h1>📊 Dashboard del Sistema</h1>

        <div class="card"><strong>Estado:</strong> 🟢 Operativo</div>
        <div class="card"><strong>Total Reservas:</strong> ${reservas.length}</div>
        <div class="card"><strong>Versión:</strong> ${version}</div>
        <div class="card"><strong>Uptime (segundos):</strong> ${uptime}</div>
        <div class="card"><strong>Fecha:</strong> ${new Date().toLocaleString()}</div>

        <a href="/reservar">Ir a Reservas</a>
      </body>
    </html>
  `);
});

/* =========================
   PÁGINA DE RESERVAS
========================= */

app.get('/reservar', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Reservas</title>
        <style>
          body { font-family: Arial; background:#eef2f7; padding:30px; }
          form { background:white; padding:20px; border-radius:8px; margin-bottom:20px; }
          input { padding:8px; margin:5px 0; width:100%; }
          button { padding:10px; background:#007bff; color:white; border:none; cursor:pointer; }
          ul { background:white; padding:15px; border-radius:8px; }
          li { margin-bottom:5px; }
          .error { color:red; }
        </style>
      </head>
      <body>

        <h1>📅 Crear Reserva</h1>

        <form id="formReserva">
          <input type="text" name="cliente" placeholder="Nombre del cliente" required />
          <input type="date" name="fecha" required />
          <button type="submit">Reservar</button>
          <p class="error" id="mensaje"></p>
        </form>

        <h2>📋 Reservas Actuales</h2>
        <ul id="listaReservas" style="list-style: none;"></ul>

        <a href="/dashboard">Volver al Dashboard</a>

        <script>
          const form = document.getElementById('formReserva');
          const lista = document.getElementById('listaReservas');
          const mensaje = document.getElementById('mensaje');

          async function cargarReservas() {
            const res = await fetch('/reservas');
            const data = await res.json();
            lista.innerHTML = '';
            data.forEach(r => {
              const li = document.createElement('li');
              li.textContent = r.cliente + " - " + r.fecha;
              lista.appendChild(li);
            });
          }

          form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const cliente = formData.get('cliente');
            const fecha = formData.get('fecha');

            const res = await fetch('/reservas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cliente, fecha })
            });

            if (res.status === 400) {
              const data = await res.json();
              mensaje.textContent = data.error;
            } else {
              mensaje.textContent = '';
              form.reset();
              cargarReservas();
            }
          });

          cargarReservas();
        </script>

      </body>
    </html>
  `);
});

module.exports = app;
