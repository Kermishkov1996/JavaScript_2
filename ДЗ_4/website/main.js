const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else  {
        xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject(xhr.responseText);
                    return
                }
                const body = JSON.parse(xhr.responseText);
                resolve(body);
            }
        };

        xhr.onerror = function (err) {
            reject(err);
        }
    
        xhr.open('GET', url);
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
        this.filteredGoods = [];
    }

    initListeners() {}

    findGood(id) { //index
        return this.goods[id];
    }

    fetchGoods() {}
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
        this.filteredGoods.forEach((good, index) => {
            const goodItem = new GoodsItem(index, good.product_name, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}

class GoodsPage extends GoodsList {
    addCartListeners(listeners) {
        this.cartListeners = listeners;
    }

    initListeners() {
        const buttons = [...this.container.querySelectorAll('.js-add-to-cart')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId, 10));
            })
        })
        const searchForm = document.querySelector('.goods-search');
        const searchValue = searchForm.querySelector('.goods-search-value');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let value = searchValue.value;
            value = value.trim();
            this.filterGoods(value);
        })
    }
    async fetchGoods() {
        try {
            this.goods = await makeGetRequest(`${API_URL}/catalogData.json`);
            this.filteredGoods = [...this.goods];
        }
        catch (err) {
            console.error(`Ошибка: ${err}`);
        }
    }

    filterGoods(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredGoods = this.goods.filter((good) => {
            return regexp.test(good.product_name);
        });
        this.render();
    }

    async addToCart(goodId) {
        try {
            const good = this.findGood(goodId);
            await makeGetRequest(`${API_URL}/addToBasket.json`);
            if (this.cartListeners) {
                this.cartListeners.addToCart(good);
            }
        }
        catch (e) {
            console.error(`Ошибка: ${e}`);
        }
    }
}

class Cart extends GoodsList {
    initListeners() {
        return {
            addToCart: (good) => {
                this.addToCart(good);
            },
        }
    }
    removeFromCart(goodId) {
        
    }
    cleanCart() {
        
    }
    updateCartItem(goodId, goods) {
        
    }
    addToCart(good) {
        this.goods.push(good);
        this.render();
    }

    render() {
        let html = '';
        this.goods.forEach(good => {
            html += `<li>${good.product_name}</li>`
        });
        this.container.innerHTML = html;
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
const cart = new Cart('.cart-goods');
const cartListeners = cart.initListeners();

list.addCartListeners(cartListeners);
list.fetchGoods().then(() => {
    list.render();
});

console.log(list.getTotalSum());