const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

function debounce(callback, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) callback.apply(context, args);
        }
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            callback.apply(context, args);
        }
    }
}

Vue.component('goods-search', {
    props: ['search'],
    computed: {
        
    },
    data: () =>({
        
    }),
    methods: {
        filteredGoodsHandler() {
            return debounce((event) => {
                const regexp = new RegExp(event.target.value.trim(), 'i');
                this.filteredGoods = this.goods.filter((good) => {
                    return regexp.test(good.product_name);
                });
            }, 300);
        }
    },
    template: `
        <form class="goods-search" @input="filteredGoodsHandler">
            <input type="text" class="goods-search-value">
        </form>
    `
});

Vue.component('cart', {
    props: ['click'],
    computed: {
        
    },
    data: () =>({
        
    }),
    methods: {
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        }
    },
    template: `
        <div class="cart">
            <button class="cart-button" @click="toggleCartVisibility">Корзина</button>
            <transition name="fade">
                <div class="cart-container" v-if="isVisibleCart">
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Наименование</th>
                        <th scope="col">Цена</th>
                        <th scope="col">Количество</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody></tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" scope="row">Итого:</td>
                        <td colspan="3">
                            <span class="total">0</span>
                            <i class="fas fa-ruble-sign"></i>
                        </td>
                    </tr>
                </tfoot>
                </table>
                    <ul class="cart-goods"></ul>
                </div>
            </transition>
        </div>
    `
});

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <div class="goods-item">
            <img src="https://via.placeholder.com/150/2C465A/FFF?text=goods-item" alt="alt">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            <button class="js-add-to-cart">Добавить</button>
        </div>
    `
});

Vue.component('goods-list', {
    props: ['goods'],
    computed: {
        isFilteredGoodsEmpty() {
            return this.goods.length === 0;
        }
    },
    template: `
        <div class="goods-list" v-if="!isFilteredGoodsEmpty">
            <goods-item v-for="good in goods" :key="good.id_product" :good="good"></goods-item>
        </div>
        <div class="goods-not-found" v-else>
            <h2>Нет данных</h2>
        </div>
    `
});

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        isVisibleCart: false,
    },
    
    methods: {
        makeGetRequest(url) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else  {
                    xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            reject(xhr.responseText);
                            return
                        }
                        const body = JSON.parse(xhr.responseText);
                        resolve(body)
                    }
                };

                xhr.onerror = function (err) {
                    reject(err)
                };

                xhr.open('GET', url);
                xhr.send();
            });
        },
        async fetchGoods() {
            try {
                this.goods = await this.makeGetRequest(`${API_URL}/catalogData.json`);
                this.filteredGoods = [...this.goods];
            } catch (e) {
                console.error(`Ошибка: ${err}`);
            }
        }
    },
    mounted() {
        this.fetchGoods();
    }
});
