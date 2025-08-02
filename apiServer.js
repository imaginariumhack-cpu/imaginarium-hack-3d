// API simple con Express para probar el envío del formulario

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Datos recibidos:', { name, email, password });
  // Aquí podrías guardar en base de datos o hacer validaciones
  res.status(200).json({ message: 'Registro exitoso' });
});




app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Intento de login:', { email, password });
  // Acá podrías validar contra base de datos o archivo
  // Por ahora simulamos login exitoso:
  res.status(200).json({ message: 'Login exitoso' });
});







app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});