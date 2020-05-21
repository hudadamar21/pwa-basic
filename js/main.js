const _url = 'https://my-json-server.typicode.com/hudadamar21/pwa-db/product';

let dataResult = ''
let categoriesResult = ''
let categories = []

const product = document.querySelector('#product');
const categoriesList = document.querySelector('#categories_list');

function renderPage(res) {
    res.forEach((item) => {

        _category = item.category

        dataResult += `<div>
                  <h3>${item.nama}</h3>
                  <p>${_category}</p>
                </div>`;

        if (categories.includes(_category) == 0) {
            categories.push(_category)
            categoriesResult += `<option value="${_category}">${_category}</option>`
        }

    });
    product.innerHTML = dataResult;
    categoriesList.innerHTML = `<option value="all">semua</option>` + categoriesResult
}

// refresh data from online
let networkDataREceived = false
let networkUpdate = fetch(_url).then(res => res.json())
    .then(data => {
        networkDataREceived = true
        renderPage(data)
    });

// return data from cache
caches.match(_url).then(res => {
    if (!res) throw Error('no data on cache')
    return res.json()
}).then(data => {
    if (!networkDataREceived) {
        renderPage(data)
        console.log('render data from cache')
    }
}).catch(error => networkUpdate)

categoriesList.addEventListener('change', function(e) {
    updateProducts(e.target.value)
});

function updateProducts(category) {
    let dataResult = ''
    let _newUrl = _url;
    if (category != 'all') {
        _newUrl = _url + `?category=${category}`
    }

    fetch(_newUrl).then(res => res.json())
        .then(res => {
            res.forEach((item) => {

                _category = item.category

                dataResult += `<div>
                                <h3>${item.nama}</h3>
                                <p>${_category}</p>
                            </div>`;

            });
            product.innerHTML = dataResult;
        })
}

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}