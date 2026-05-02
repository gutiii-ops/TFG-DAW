/**
 * Genera un código de pedido profesional semi-estructurado.
 * Formato: GM-YYMM-XXXXXX
 * Ejemplo: GM-2405-7K9P2W
 */
const generateOrderCode = () => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Alfabeto alfanumérico (excluyendo caracteres ambiguos si se desea, 
    // pero aquí usaremos el estándar A-Z, 0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `GM-${yy}${mm}-${randomPart}`;
};

module.exports = {
    generateOrderCode
};
