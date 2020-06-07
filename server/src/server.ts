import express from 'express';
import router from './routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
const app = express();

// É utilizado para informar quais URLs terão acesso a API
app.use(cors());

// Faz com que o body da requisição seja convertido em objeto json
app.use(express.json())

app.use('/public', express.static(path.resolve(__dirname,'..','public')));

// Rota: endereço completo
// Recurso: Qual entidade estamos acessando no sistema
// GET: Buscar uma ou mais informações do back-end
// POST: Criar uma nova informação noback-end
// PUT: Atualizar uma informação existente
// DELETE: Remover uma informação do back-end
// Request Param: Parâmetros que vem na própria rota que identificam um recurso
// Query Param: Parâmetros que vem na própria rota, geralmente opcionais para filtros, paginação, etc...
// Request Body: Parâmetros para criação/atualização de informações

app.use(router);

app.use(errors());

app.listen(3333);

