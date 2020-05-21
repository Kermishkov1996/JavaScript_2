function debounce(callback, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) callback.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            callback.apply(context, args);
        }
    }
}

Vue.component('notification', {
    data: () => ({
        error: null,
        wait: 3000,
    }),
    methods: {
        notify(error) {
            this.error = error;
            setTimeout(() => {
                this.clean();
            }, this.wait)
        },
        clean() {
            this.error = null;
        },
    },
    template: `
        <div class="notification">
            <transition name="fade">
                <span v-if="error">{{ error.message }}</span>
            </transition>
        </div>
    `
});

Vue.component('goods-search', {
    props: ['goods', 'filteredGoods'],
    computed: {
        filter() {
            return debounce((event) => {
                const regexp = new RegExp(event.target.value.trim(), 'i');
                const filteredGoods = this.goods.filter((good) => {
                    return regexp.test(good.name);
                });
                this.$emit('update:filteredGoods', filteredGoods);
            }, 300);
        }
    },
    template: `
        <form class="goods-search">
            <input type="text" @input="filter" class="goods-search-value">
        </form>
    `
});

Vue.component('goods-item', {
    props: ['good'],
    methods: {
        addToCart() {
            return this.$emit('add', this.good);
        }
    },
    template: `
        <div class="goods-item">
            <img :src="good.img" alt="alt">
            <h3>{{ good.name }}</h3>
            <p>{{ good.price }}</p>
            <button class="js-add-to-cart" @click="addToCart">Добавить</button>
        </div>
    `
});

Vue.component('goods-list', {
    props: ['goods'],
    computed: {
        isGoodsEmpty() {
            return this.goods.length === 0;
        }
    },
    methods: {
        addToCart(good) {
            return this.$emit('add', good);
        }
    },
    template: `
        <div class="goods-list" v-if="!isGoodsEmpty">
            <goods-item v-for="good in goods" @add="addToCart" :key="good.id" :good="good"></goods-item>
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
                } else {
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
        makePostRequest(url, data) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
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

                xhr.open('POST', url);
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(JSON.stringify(data));
            });
        },
        async fetchGoods() {
            try {
                this.goods = await this.makeGetRequest(`/api/goods`);
                this.filteredGoods = [...this.goods];
            } catch (e) {
                this.$refs.notification.notify(new Error(e));
                console.error(e);
            }
        },
        async addToCart(good) {
            try {
                this.makePostRequest('/api/cart', good);
                console.log('add good to cart');
            } catch (e) {
                this.$refs.notification.notify(new Error(e));
                console.error(e);
            }
        },
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.fetchGoods();
        });
    }
});
