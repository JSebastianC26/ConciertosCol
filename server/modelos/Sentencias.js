import constructor from '../Controladores/CrearSentencia.js';

const Roles = new constructor.CrearSentencia('tRoles');
const Usuarios = new constructor.CrearSentencia('tUsuarios');

const Categorias = new constructor.CrearSentencia('tCategorias');
const Ciudades = new constructor.CrearSentencia('tCuidades');
const Estados = new constructor.CrearSentencia('tEstados');
const LugaresEventos = new constructor.CrearSentencia('tLugaresEventos');
const Localidades = new constructor.CrearSentencia('tLocalidades');
const Eventos = new constructor.CrearSentencia('tEventos');
const EventosLocalidades = new constructor.CrearSentencia('tEventosLocalidades');

const Sentencias = {
    Roles,
    Usuarios,
    Categorias,
    Ciudades,
    Estados,
    LugaresEventos,
    Localidades,
    Eventos,
    EventosLocalidades
}

export default Sentencias;