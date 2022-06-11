var page = new Paging();

function searchRecipes() {

    //grab the search term
    const searchM = document.querySelector('#searchBox').value;

    const endpoint = 'https://api.edamam.com/search?q=' + searchM + '&app_id=53c99899&app_key=5bcac43624cd4fde163db0d5b37859e3&from=0&to=48';
    $.ajax({
        url: endpoint,
        Accept: 'application/json',
        Headers: {'Api-User-Agent': 'Search-Here'},
        ContentType: "application/x-www-form-urlencoded",
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            var label = '';
            var image = '';
            var searchButton = '';
            var source = '';

            var detail = '';
            var url = '';

            function reset() {
                // 重置清除字段
                var childRemove = $('.results').remove();
                return childRemove;
            }

            reset();

            // for (var i = 0; i < data.results.length; i++) {
            //     label = data.results[i].recipe["label"];
            //     image = data.results[i].recipe["image"];
            //     source = data.results[i].recipe["source"];
            //     url = data.results[i].recipe["url"];
            //
            //     var results = ('<figure class="results"><a href="' + url + '" target="_blank"><img src="' + image + '"alt=' + label + '"/><h4 class="results_label">' + label + '</h4><h5 class="results_source">From ' + source + '</h5></a></figure>');
            //     $('.displaySearch').append(results);
            //     document.getElementById("about").style.display = "none";
            //
            // }
            //
            // document.getElementById('searchBox').textContent = '';

        },
        error: function (err) {
            alert('sorry, something is wrong!');
        },
    });

}

// 点击搜索的时候
document.getElementById('search').addEventListener('click', initDate);

// You can also press the enter key 
document.getElementById("searchBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("search").click();
    }
});

let count = 1;

function initDate(_, offset = 1) {
    const searchM = document.querySelector('#searchBox').value.trim() || '';

    //offset	数字	0	分页的偏移量（0 到 990 之间）。
    // number	数字	100	预期结果的数量（1 到 10 之间）。
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        Accept: 'application/json',
        Headers: {'Api-User-Agent': 'Search-Here'},
        ContentType: "application/x-www-form-urlencoded",
        type: 'GET',
        data: {
            offset: offset,
            apiKey: 'b067504655464f7c855dca4d0743ffa8',
            number: 5,
            query: searchM,
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            // // 加载分页信息
            if (count === 1) {
                page.init({
                    target: $('#pageTool'),
                    pagesize: 5,
                    count: data.totalResults,
                    current: data.offset,
                    callback: pageChange
                });
                ++count;
            } else if (data.totalResults === 0 || data.totalResults < 6) {
                // 当没有数据的时候删除分页
                $('.ui-paging-container').remove();
                count = 1;
            } else {
                page.render({
                    count: data.totalResults,
                    current: offset,
                });
            }

            // 加载页面信息
            var label = '';
            var image = '';
            var searchButton = '';
            var source = '';

            var detail = '';
            var url = '';

            function reset() {
                // 重置清除字段
                var childRemove = $('.results').remove();
                return childRemove;
            }

            reset();

            for (var i = 0; i < data.results.length; i++) {
                label = data.results[i].title;
                image = data.results[i].image;
                // source = data.results[i].recipe["source"];
                url = './details.html?id=' + data.results[i].id;

                var results = ('<figure class="results"><a href="' + url + '"><img src="' + image + '"alt=' + label + '"/><h4 class="results_label">' + label + '</h4></a></figure>');
                $('.displaySearch').append(results);
                document.getElementById("about").style.display = "none";
            }

            document.getElementById('searchBox').textContent = '';
        },
        error: function (err) {
            alert('sorry, something is wrong!');
        },
    });
}

initDate()

function pageChange(pageCount, size, count) {
    console.log('当前第 ' + pageCount + '页,每页 ' + size + '条,总页数：' + count + '页');
    initDate('', pageCount)
}
