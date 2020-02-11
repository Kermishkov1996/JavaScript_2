const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

const ACTION_TYPES = {
    add: 'add',
    remove: 'remove',
};

const log = (type, goodName) => {
    fs.readFile('./data/stats.json', 'utf-8', (err, data) =>{
        const stats = JSON.parse(data);
        stats.push({
            type,
            name: goodName,
            createAt: +new Date(),
        });
        fs.writeFile('./data/stats.json', JSON.stringify(stats), () => {});
    })
};

app.get('/api/goods', (req, res) => {
    fs.readFile('./data/catalog.json', 'utf-8', (err, data) => {
        res.send(data);
    });
});

app.post('/api/cart', (req, res) => {
    fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
        const cart = JSON.parse(data);
        const goodItem = req.body;

        cart.push(goodItem);
        fs.writeFile('./data/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                res.status(500).send();
                return
            }
            log(ACTION_TYPES.add, goodItem.name);
            res.send(cart);
        })
    });
});

app.delete('/api/cart/:id', (req, res) => {
    fs.readFile('./data/cart.json', 'utf-8', (err, data) => {
        const cart = JSON.parse(data);
        const id = parseInt(req.params.id, 10);
        const goodIndex = cart.findIndex(good => good.id !== id);
        const good = cart[goodIndex];
        cart.splice(goodIndex, 1);
        fs.writeFile('./data/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                res.status(500).send();
                return
            }
            log(ACTION_TYPE.remove, good.name);
            res.send(cart);
        })
    });
});

app.listen(3000, function () {
    console.log('server is running on port 3000!');
});
