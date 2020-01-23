class GoodsItem {
    constructor(id, title = 'Без названия', price = 0, img = '') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render() {
        return `
            <div class="goods-item" data-id="${this.id}">
                <img src="${this.img}" alt="alt">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <i class="fas fa-ruble-sign"></i>
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

    initListeners() {
        const buttons = [...this.container.querySelectorAll('.js-add-to-cart')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId, 10));
            })
        })
    }

    findGood(id) {
        return this.goods.find(good => good.id === id);
    }

    addToCart(goodId) {
        const good = this.findGood(goodId);
        console.log(good);
        //console.log(good.price);
        this.renderTotalSum();
    }

    fetchGoods() {
        this.goods = [
            { id: 1, title: "Шкаф", price: 2000, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            { id: 2, title: "Стол", price: 2500, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            { id: 3, title: "Стул", price: 3200, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            { id: 4, title: "Диван", price: 2600, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            //{ id: 5, title: "Пылесос", price: 3000, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            //{ id: 6, title: "Картина", price: 1500, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            //{ id: 7, title: "Дверь", price: 4200, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
            //{ id: 8, title: "Часы", price: 1600, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
        ]
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.id, good.title, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }

    /**
     * Метод отображает общую сумму заказа.
     */
    renderTotalSum() {
        const total = this.getTotalSum();
        console.log(total);
    }

    /**
     * Метод считает стоимость всех товаров в корзине.
     * @returns {number}
     */
    getTotalSum() {
        let sum = 0;
        for (let key in this.goods) {
            sum += this.goods[key].price; //* this.goods[key].count;
        }
        return sum;
    }
}

const list = new GoodsList('.goods-list');
list.fetchGoods();
list.render();


class CartOfGoods {
    constructor() {
        
    }
    /**
     * Обработчик события клика по кнопке удаления товара, который пересчитывает сумму товаров.
     */
    removeProductListener() {
        
    }
}

class CartItems {
    constructor() {
        
    }
    /**
     * Метод добавляет товар в объект с товарами(увелич. кол-во товаров).
     */
    addProductToObject() {
        
    }

    /**
     * Метод удаляет товар из объекта товаров, а также из корзины на странице.
     * @param {MouseEvent} evt
     */
    removeProduct(evt) {
        
    }

    /**
     * Метод либо удаляет товар из корзины, либо уменьшает кол-во товара, если его больше 1.
     * @param {string} id
     */
    removeProductFromBasket(id) {
        
    }
    /**
     * Метод удаляет продукт из объекта с продуктами.
     * @param {string} id
     */
    removeProductFromObject(id) {
        
    }
}