import users from '../data/users.js';
import { generateToken, verifyToken } from '../utils/auth.js';

function sendJSONResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json'})
  res.end(JSON.stringify(data));
}

function registerUser(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { username, password } = JSON.parse(body);

    // Validação básica
    if (!username || !password) {
      return sendJSONResponse(res, 400, { message: 'Username and password are required' });
    }
    
    // Verificar se o usuário já existe
    const userExists = users.find(user => user.username === username);
    if ( userExists ) {
      return sendJSONResponse(res, 409, { message: 'Username already exists' });
    }

    //criar novo usuário
    const userId = users.length + 1;
    const newUser = {id: userId, username, password}
    users.push(newUser);

    sendJSONResponse(res, 201, {message: 'User created successfully', userId})
  })
}

export function loginUser(req, res ) {
  let body = '';  
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { username, password } = JSON.parse(body)

    // Encontrar usuário
    const user = users.find(user => user.username === username && user.password === password);
    if (!user ){
      return sendJSONResponse(res,401, { message: 'Invalid username or password'})
    }

    // gerar token
    const token = generateToken(user.id)
    sendJSONResponse(res, 200, { message: 'Login successful', token})
  })
}

// Função para obter o perfil de um usuário
export function getUserProfile(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) {
    return sendJSONResponse(res, 403, { message: 'Unauthorized'});
  }

  //veriricar token
  const userId = verifyToken(token);
  if(!userId) {
    return sendJSONResponse(res, 403, { message: 'Invalid token'});
  }
  
  // Obter usuário
  const user = users.find(user => user.id === parseInt(userId));
  if(!user ){
    return sendJSONResponse(res, 404, { message: 'User not found'});
  };

  sendJSONResponse(res, 200, { user })
}