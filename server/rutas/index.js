const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
    const eventos = [
        {
            titulo: "Concierto de Rock Nacional",
            fecha: "2025-06-15",
            agotado: false,
        },
        {
            titulo: "Festival de Música Electrónica",
            fecha: "2025-06-22",
            agotado: false,
        },
        {
            titulo: "Concierto Sinfónico",
            fecha: "2025-07-03",
            agotado: false,
        }];


    const sliderData = [
        {
            titulo: "Concierto de Rock Nacional",
            descripcion: "Vive la experiencia más intensa con las mejores bandas de rock del país. Una noche llena de energía, música en vivo y momentos inolvidables que quedarán grabados en tu memoria para siempre.",
            url: "https://picsum.photos/id/1015/1200/500",
            alt: "Concierto Rock",
            posicion: 1
        },
        {
            titulo: "Concierto de Rock Nacional",
            descripcion: "Vive la experiencia más intensa con las mejores bandas de rock del país. Una noche llena de energía, música en vivo y momentos inolvidables que quedarán grabados en tu memoria para siempre.",
            url: "https://picsum.photos/id/1016/1200/500",
            alt: "Festival Electrónico",
            posicion: 2
        },
        {
            titulo: "Concierto de Rock Nacional",
            descripcion: "Vive la experiencia más intensa con las mejores bandas de rock del país. Una noche llena de energía, música en vivo y momentos inolvidables que quedarán grabados en tu memoria para siempre.",
            url: "https://picsum.photos/id/1018/1200/500",
            alt: "Concierto Sinfónico",
            posicion: 3
        }
    ];

    res.render("Home", {
        title: "Home - Conciertos y Eventos COL",
        sliderData,
        eventos
    })
});


// Rutas admin (requieren autenticación)
// app.use('/admin', require('./middleware/auth'), require('./middleware/admin'));

// app.get('/admin', (req, res) => {
//     res.render('admin/dashboard', {
//         title: 'Panel Admin',
//         layout: 'layouts/admin'
//     });
// });

// app.get('/admin/users', (req, res) => {
//     res.render('admin/users', {
//         title: 'Gestión Usuarios',
//         layout: 'layouts/admin'
//     });
// });

// Error handlers
// app.use((req, res) => {
//     res.status(404).render('errors/404', { title: 'Página no encontrada' });
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('errors/500', {
//         title: 'Error del servidor',
//         error: process.env.NODE_ENV === 'development' ? err : {}
//     });
// });
module.exports = router;