import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.get("/",(req, res) => {
    res.send('Hello, s!');
})

const readData = () => {
    try{
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    }catch(error){
        console.error('Error reading data:', error);
        
    }
}

const writeData = (data) => {
    try{
        fs.writeFileSync('./db.json', JSON.stringify(data));
    }catch(error){
        console.error('Error writing data:', error);
    }
}

//get
app.get('/libros',(req, res) => {
    const data = readData();
    res.json(data);
})

//GET PARA RECURSO ESPECIFICO
app.get("/libros/:id",(req, res) => {
    const data = readData();
    const id = parseInt(req.params.id)
    const book = data.books.find((book) => book.id === id)
    res.json(book)
})

//post
app.post("/crear",(req, res) => {
    const data = readData();
    const body = req.body;
    const newLibro = {
        id: data.books.length + 1,
        ...body,
    }
    data.books.push(newLibro);
    writeData(data);
    res.json(newLibro);
})

//PUT
app.put("/librosE/:id",(req, res) => {
    const data = readData();
    const id = parseInt(req.params.id)
    const body = req.body;
    const index = data.books.findIndex((book) => book.id === id)

    data.books[index] = {...data.books[index],...body};
    writeData(data);
    res.json(data.books[index]);
})


//DELETE
app.delete("/librosD/:id",(req, res) => {
    const data = readData();
    const id = parseInt(req.params.id)
    const index = data.books.findIndex((book) => book.id === id)

    if(index!== -1){
        data.books.splice(index, 1);
        writeData(data);
        res.json({message: 'Libro eliminado'});
    }else{
        res.status(404).json({message: 'Libro no encontrado'});
    }
})


app.listen(3000,() => {
    console.log('Server is running on port 3000');
})