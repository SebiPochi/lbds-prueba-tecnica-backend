import { createApp } from './app.js';
import { AuthModel } from './models/auth.js';
import { BorrachoModel } from './models/borracho.js';
import { PartidoModel } from './models/partido.js';
createApp(new PartidoModel(), new AuthModel(), new BorrachoModel());
