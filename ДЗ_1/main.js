const goods = [
    { title: "Шкаф", price: 2000, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Стол", price: 2500, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Стул", price: 3200, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Диван", price: 2600, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Пылесос", price: 3000, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Картина", price: 1500, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Дверь", price: 4200, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
    { title: "Часы", price: 1600, img: 'https://via.placeholder.com/150/2C465A/FFF?text=goods-item' },
];

const renderGoodsItem = (title, price, img = '') => 
        `<div class="goods-item">
        <img src="${img}" alt="alt">
        <h3>${title}</h3>
        <p>${price}</p>
        </div>`
    ;

const renderGoodsList = (list, container) => {
    const goodsList = list.map(good => renderGoodsItem(good.title, good.price, good.img));
    document.querySelector(container).innerHTML = goodsList.join('');
};

renderGoodsList(goods, '.goods-list');
