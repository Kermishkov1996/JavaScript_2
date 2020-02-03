const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
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
        },
        initListeners() {
            const searchForm = document.querySelector('.goods-search');
            const searchValue = searchForm.querySelector('.goods-search-value');
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let value = searchValue.value;
                value = value.trim();
                this.filterGoods(value);
            })
        },
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.filter((good) => {
                return regexp.test(good.product_name);
            });
        },
    },
    mounted() {
        this.fetchGoods();
        this.initListeners();
    }
});
