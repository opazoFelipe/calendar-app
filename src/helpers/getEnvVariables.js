export const getEnvVariables = () => {
    
    // import.meta.env

    return {
        // ...import.meta.env

        // Solucion para el script build para subir a production
        // Issue: Import meta
        VITE_API_URL: import.meta.env.VITE_API_URL
    }

}