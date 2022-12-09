const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const Binance = require('binance-api-node').default

const PORT = process.env.PORT || 5000

const app = express()

const server = http.createServer(app)

const client = Binance();

const io = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
})


io.on('connection',(socket)=>{

    console.log('client connected: ',socket.id)
    
    socket.join('crypto-room')
    
    socket.on('disconnect',(reason)=>{
      console.log(reason)
    })
})


client.ws.allMiniTickers((tickers)=>{
    io.to('crypto-room').emit('tickers', tickers)
})


server.listen(PORT, err=> {
    if(err) console.log(err)
    console.log('Server running on Port ', PORT)
})
