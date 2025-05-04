const axios = require('axios');

/**
 * Añade un usuario al sistema usando el endpoint real de registro
 */
async function addUserToDatabase(email, password) {
    try {
        const response = await axios.post('http://localhost:8000/api/register', {
            name: "Test User",
            email: email,
            password: password,
            userRole: "user"
        });

        console.log(`Usuario ${email} creado exitosamente.`);
        return response.data;

    } catch (error) {
        if (error.response) {
            console.error(`Error creando usuario: ${error.response.status} ${error.response.statusText}`);
            console.error(`Error response: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error creando usuario: ${error.message}`);
        }
        throw new Error('Fallo al crear usuario de test');
    }
}

module.exports = { addUserToDatabase };
