function myfunc(key) {
    var url = window.location.href;//首先获取url
    if (url.indexOf("?") != -1) {    //判断是否有参数
        var strSub = null;
        var str = url.split("?");//根据？截取url
        var strs = str[1].split("&");//str[1]为获取？号后的字符串，并且根据&符号进行截取，得到新的字符串数组，这个字符串数组中有n个key=value字符串
        for (var i = 0; i < strs.length; i++) {//遍历字符串数组
            strSub = strs[i].split("=");//取第i个key=value字符串，并用“=”截取获得新的字符串数组 这个数组里面第0个字符是key，第1个字符value
            if (strSub[0] == key) {//判断第0个字符与该方法的参数key是否相等，如果相等 则返回对应的值value。
                if(strSub[1].includes('#')){
                    return strSub[1].split('#')[0]
                }
                return strSub[1];
            }
        }
    }
    return "";
}

function initDate() {
    const id = myfunc("id");
    console.log(id);
    $.ajax({
        url: `https://api.spoonacular.com/recipes/${id}/information`,
        // url: `https://api.spoonacular.com/food/ingredients/9266/information`,
        Accept: 'application/json',
        Headers: {'Api-User-Agent': 'Search-Here'},
        ContentType: "application/x-www-form-urlencoded",
        type: 'GET',
        data: {
            apiKey: 'b067504655464f7c855dca4d0743ffa8',
            id: id
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            const {title,extendedIngredients,instructions,image,analyzedInstructions,winePairing} = data;
            const descriptionHTML = `<h1>${title}</h1><p>${winePairing.pairingText}</p>`;
            $('.description').append(descriptionHTML);
            // 成分表
            for (let i = 0; i < extendedIngredients.length; i++) {
                $('.ingredients').append(`<li><span>${extendedIngredients[i].original}</span></li>`)
            }
            // 过程
            // $('.instructions-p').html(instructions)
            for (let i = 0; i < analyzedInstructions[0].steps.length; i++) {
                $('.instructions').append(` <li><span>${analyzedInstructions[0].steps[i].step}</span></li>`)
            }

            // 图片
            $('.imagesFigure').append(` <figure>
            <img src=${image}>
        </figure> <p class="tip">Clicking each ingredient or stage of the cooking process will strike it through to show it's
            complete.</p>`)
        },
        error: function (err) {
            alert('sorry, something is wrong!');
        },
    });
}

initDate();
