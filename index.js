const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura la conexión a SQL Server
const config = {
  user: 'ANTHONY',
  password: 'lgp911',
  server: 'localhost',
  database: 'CertificacionesDB',
  options: {
    encrypt: false, // si es local, déjalo en false
    trustServerCertificate: true
  }
};

// Ruta para validar el código
app.get('/validar/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Certificaciones WHERE codigo = ${codigo}`;

    if (result.recordset.length > 0) {
      res.json({ valido: true, datos: result.recordset[0] });
    } else {
      res.json({ valido: false });
    }
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});