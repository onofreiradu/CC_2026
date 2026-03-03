const http = require('http');
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'CC_hw1',
    password: 'admin',
    port: 5432,
});

client.connect()
    .then(() => console.log('Conectat la baza de date'))
    .catch(err => console.error('Eroare conexiune DB:', err));

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    

    const idMatch = req.url.match(/^\/tasks\/([0-9]+)$/);

    try {
        
        if (req.method === 'GET' && req.url === '/tasks') {
            const result = await client.query('SELECT * FROM tasks ORDER BY id ASC');
            res.writeHead(200);
            res.end(JSON.stringify(result.rows));
        } 
        else if (req.method === 'GET' && idMatch) {
            const id = idMatch[1]; 
            
            try {
                const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
                
                if (result.rowCount === 0) {
                   
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: 'Sarcina nu a fost gasita' }));
                } else {
                    
                    res.writeHead(200);
                    res.end(JSON.stringify(result.rows[0]));
                }
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Eroare interna de server' }));
            }
        }
       
        else if (req.method === 'POST' && req.url === '/tasks') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const result = await client.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [data.title]);
                    res.writeHead(201);
                    res.end(JSON.stringify(result.rows[0]));
                } catch (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Date invalide' }));
                }
            });
        } 
        
        
        else if (req.method === 'PUT' && idMatch) {
            const id = idMatch[1];
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const result = await client.query(
                        'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *', 
                        [data.title, data.completed, id]
                    );
                    
                    if (result.rowCount === 0) {
                        res.writeHead(404);
                        res.end(JSON.stringify({ error: 'Sarcina nu a fost gasita' }));
                    } else {
                        res.writeHead(200);
                        res.end(JSON.stringify(result.rows[0]));
                    }
                } catch (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Eroare la actualizare' }));
                }
            });
        } 
        
        
        else if (req.method === 'DELETE' && idMatch) {
            const id = idMatch[1];
            const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
            
            if (result.rowCount === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Sarcina nu a fost gasita' }));
            } else {
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Sters cu succes' }));
            }
        } 
        

        else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Ruta invalida' }));
        }
        
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Eroare interna de server' }));
    }
});

server.listen(8081, () => {
    console.log('Serverul ruleaza http://localhost:8081');
});