import http from 'node:http';
import url from 'node:url';
import { registerUser, loginUser, getUserProfile } from './controllers/userController.js';

const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname
  const method = req.method

  if(path === '/register' && method === 'POST') {
    registerUser(req, res)
  } else if (path === '/login' && method === 'POST') {
    loginUser(req, res)
  } else if (path === '/profile' && method === 'GET') {
    getUserProfile(req, res)
  } else {
    res.writeHead(404, { 'Content-type' : 'application/json'})
    res.end(JSON.stringify({ message: 'Route not found'}))
  }
})

const PORT = 3334
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})