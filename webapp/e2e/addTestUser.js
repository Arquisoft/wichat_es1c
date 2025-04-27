const fetch = require('node-fetch');

/**
 * Añade un usuario al sistema usando el endpoint real de registro
 */
async function addUserToDatabase(email, password) {
    const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Test User",
            email: email,
            password: password,
            userRole: "user"
        })
    });

    if (!response.ok) {
        console.error(`Error creando usuario: ${response.status} ${response.statusText}`);
        const errorBody = await response.text();
        console.error(`Error response: ${errorBody}`);
        throw new Error('Fallo al crear usuario de test');
    }

    console.log(`✅ Usuario ${email} creado exitosamente.`);
    return response.json();
}

module.exports = { addUserToDatabase };
