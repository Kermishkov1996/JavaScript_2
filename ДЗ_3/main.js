const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else  {
        xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(xhr.responseText)
            } else {
                reject("Error")
            }
        };
    
        xhr.open('GET', url, true);
        xhr.send();
    });
}

class GoodsItem {
    constructor(id, product_name = 'Без названия', price = 0, img = 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item') {
        this.id = id;
        this.product_name = product_name;
        this.price = price;
        this.img = img;
    }
    render() {
        return `
            <div class="goods-item" data-id="${this.id}">
                <img src="${this.img}" alt="alt">
                <h3>${this.product_name}</h3>
                <p>${this.price}</p>
                <button class="js-add-to-cart">Добавить</button>
            </div>
        `;
    }
}

class GoodsList {
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
    }

    initListeners() {}
    findGood(id) {
        return this.goods.find(good => good.id === id);
    }
    /**
     * Метод считает стоимость всех товаров в корзине.
     * @returns {number}
     */
    getTotalSum() {
        let sum = 0;
        for (let key in this.goods) {
            sum += this.goods[key].price;
        }
        return sum;
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.id, good.product_name, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}

class GoodsPage extends GoodsList {
    initListeners() {
        const buttons = [...this.container.querySelectorAll('.js-add-to-cart')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId, 10));
            })
        })
    }
    fetchGoods(callback) {
        makeGetRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            callback();
        })
    }
    addToCart(goodId) {
        const good = this.findGood(goodId);
        console.log(good);
    }
}

class Cart extends GoodsList {
    removeFromCart(goodId) {
        makeGetRequest(`${API_URL}/deleteFromBasket.json`, (goods) => {
            this.goods = JSON.parse(goods);
            callback();
        })
    }
    cleanCart() {
        makeGetRequest(`${API_URL}/getBasket.json`, (goods) => {
            this.goods = JSON.parse(goods);
            callback();
        })
    }
    updateCartItem(goodId, goods) {
        makeGetRequest(`${API_URL}/addToBasket.json`, (goods) => {
            this.goods = JSON.parse(goods);
            callback();
        })
    }
}

class CartItem extends GoodsItem {
    constructor(...attrs) {
        super(attrs);
        this.count = 0;
    }
    incCount() {

    }
    decCount() {

    }
}

const list = new GoodsPage('.goods-list');
list.fetchGoods(() => {
    list.render();
});
console.log(list.getTotalSum());
