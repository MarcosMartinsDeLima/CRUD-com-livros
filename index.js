const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conne')

const app = express()

app.engine('handlebars',exphbs.engine())
app.set('view engine','handlebars')

app.use(express.static('views'))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())



app.get('/',(req,resp)=>{
    resp.render('home')
})

app.post('/book/insertbook',(req,resp)=>{
    const title = req.body.title
    const pageqtd = req.body.pageqty

    const queries = `INSERT INTO books(??,??) VALUES(?,?)`
    const data =['title','pageqty',title,pageqtd]

    pool.query(queries,data,function(err){
        if(err){
            console.log(err)
        } 
    })
    
    resp.redirect('/')
}) 

app.get('/books',(req,resp)=>{
    const queries = 'SELECT * FROM books'
    pool.query(queries,function(err,data){
        if(err){console.log(err)}
        const books = data
        console.log(data)
        resp.render('books',{books})
    })
})

app.get('/books/:id',(req,resp)=>{
    const id = req.params.id
    const queries = `SELECT * FROM books WHERE ?? =?`
    const data = ['id_book',id]
    pool.query(queries,data,function(err,data){
        if(err){console.log(err)}
        console.log(data)
        const book = data[0]
        resp.render('book',{book})
    })
})

app.get('/books/edit/:id',(req,resp)=>{
    const id = req.params.id
    const queries = `SELECT * FROM BOOKS WHERE id_book = ${id}`
    pool.query(queries,function(err,data){
        if(err){console.error(err)}
        const book = data[0]
        resp.render('editbook',{book})
    })
})

app.post('/books/updatedbook',(req,resp)=>{
    const id = req.body.id_book
    const title = req.body.title
    const pageqty = req.body.pageqty
    
    const queries = `UPDATE books SET ?? = ?,?? =? WHERE ?? =?`
    const data = ['title',title,'pageqty',pageqty,'id_book',id]
    pool.query(queries,data,function(err,data){
        if(err){console.error(err); return}
        const book = data[0]
        resp.redirect('/books')
    })
})

app.post('/books/remove/:id', (req,resp)=>{
    const id = req.params.id
    const queries = `DELETE FROM books WHERE ?? = ?`
    const data =['id_book',id]

    pool.query(queries,data,function(err){
        if(err){console.log(err)}
        resp.redirect('/books')
    })
})

app.listen(3000,()=>{
    console.log('server aberto')
})