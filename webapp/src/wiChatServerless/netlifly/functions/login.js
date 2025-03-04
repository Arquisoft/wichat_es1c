
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; //Variable de entorno almacenada en Netlify
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    return cachedClient;
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Falta email o password' })
      };
    }

    const client = await connectToDatabase();
    const db = client.db('wichat-db'); 
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user || user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Email o contraseña inválidos' })
      };
    }

    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login exitoso', userId: user._id })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
};
