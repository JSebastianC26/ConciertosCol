const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
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
        sliderData 
    })
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
