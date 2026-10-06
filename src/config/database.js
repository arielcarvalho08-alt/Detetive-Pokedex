const moongose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await moongose.connect(process.env.MONGO_URI);
        console.log(`[MongoDB] Conectado com sucesso: ${conn.connection.host}`);
    } catch (error) {
    console.error(`[Erro no MongoDB]: ${error.message}`);
    process.exit(1);
    }
}

module.exports = connectDB;