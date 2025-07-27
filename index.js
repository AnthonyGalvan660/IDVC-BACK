const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Conexión PostgreSQL vía Sequelize (Railway)
const sequelize = new Sequelize('railway', 'postgres', 'RKzSEUyULQYpgahvfhInHbIFWbrvfHdA', {
  host: 'turntable.proxy.rlwy.net',
  port: 12021,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// ✅ Modelo Sequelize para certificaciones
const Certificacion = sequelize.define('certificaciones', {
  codigo: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  razon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

// 🔁 Endpoint de validación
app.get('/validar/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const resultado = await Certificacion.findOne({
      attributes: ['razon', 'nombre', 'tipo', 'fecha_emision'],
      where: { codigo }
    });

    if (resultado) {
      res.json({
        valido: true,
        datosCertificacion: resultado
      });
    } else {
      res.json({
        valido: false,
        mensaje: 'Código no encontrado'
      });
    }
  } catch (error) {
    console.error('Error en la validación:', error);
    res.status(500).send('Error interno al validar el código');
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Error al conectar con PostgreSQL:', err);
  }
});