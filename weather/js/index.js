(function () {
    // 背景
    let dateTime = new Date();
    let hours = dateTime.getHours();
    if (hours >= 6 && hours < 12) {
        $(".weather-box").removeClass("night");
        $(".weather-box").addClass("morning");
    } else if(hours >= 12 && hours < 19) {
        $(".weather-box").removeClass("morning");
        $(".weather-box").addClass("afternoon");
    }else{
        $(".weather-box").removeClass("afternoon");
        $(".weather-box").addClass("night");
    }

    // 切换
    $(".day").on("click", function () {
        $(".day .line").show();
        $(".hour .line").hide();
        $(".content .day_con").show();
        $(".content .hour_con").hide();
    })
    $(".hour").on("click", function () {
        $(".hour .line").show();
        $(".day .line").hide();
        $(".content .hour_con").show();
        $(".content .day_con").hide();
    })

    // 搜索
    $(".search-icon").on("click",function(){
        // 获取输入的城市
        let city = $(".search-ipt").val();
        console.log("city==>",city);
        // 城市
        $("#city").text(city);
        // 天气
        cityWeather(city);
    })

    // 地图api
    function localIp() {
        $.ajax({
            type: 'get',
            url: 'https://apis.map.qq.com/ws/location/v1/ip',
            data: {
                key: 'RDLBZ-YDA6K-XTZJA-APWNM-QDGQ2-RUBON',
                output: 'jsonp'
            },
            dataType: 'jsonp',
            success: function (res) {
                console.log("res==>", res);
                if (res.result.ad_info.city == "") {
                    alert("暂无该城市数据");
                    return;
                }
                // 城市
                $("#city").text(res.result.ad_info.city);
                // 城市时况天气
                cityWeather(res.result.ad_info.city);
            },
            error: function (error) {
                console.log("error==>", error);
            }
        })
    }
    localIp();

    // 天气数据
    function cityWeather(city) {
        if (city == "") {
            alert("暂无该城市的天气预报");
            return;
        }
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather',
            data: {
                location: city,
                key: '6992992d312147da88517c9affac45c9'
            },
            success: function (res) {
                console.log("res==>", res);
                let getWeather = res.HeWeather6[0];

                $(".w").each(function () {
                    // 获取当前id
                    let id = $(this).attr('id');
                    // 设置数据
                    $(this).text(getWeather.now[id]);
                })

                // 最大最小温度
                let min_tmp = getWeather.daily_forecast[0].tmp_min;
                let max_tmp = getWeather.daily_forecast[0].tmp_max;
                $("#tmp_min_max").text(min_tmp + "℃ ~" + max_tmp + "℃");

                //获取分钟级降水
                getRain(getWeather.basic.lon, getWeather.basic.lat);

                // 最近五天天气
                $(".date").each(function (index) {
                    if (index > 4) {
                        return;
                    } else {
                        let index1 = res.HeWeather6[0].daily_forecast[index];
                        let date = (index1.date).substring(5);
                        $(this).text(date);
                        $(".cond_txt_d").eq(index).text(index1.cond_txt_d);
                        // 图片
                        $(".weatherImg li").eq(index).html(
                            '<img src = "./images/' + index1.cond_code_d + '.png" ' +
                            ' alt = "' + index1.cond_txt_d + '" title = "' + index1.cond_txt_d + '"/>'
                        );
                        // 最小最大温度
                        let min = index1.tmp_min;
                        let max = index1.tmp_max;
                        $(".min_max_weather li").eq(index).text(min + "℃ ~" + max + "℃");
                    }
                })

                // 接下来五小时的天气
                $(".hours").each(function (index) {
                    if (index > 4) {
                        return;
                    } else {
                        let index1 = res.HeWeather6[0].hourly[index];
                        let time = (index1.time).substring(11);
                        $(this).text(time);
                        $(".hours_weather").eq(index).text(index1.cond_txt);
                        // 图片
                        $(".hours_weather_img li").eq(index).html(
                            '<img src = "./images/' + index1.cond_code + '.png" ' +
                            ' alt = "' + index1.cond_txt + '" title = "' + index1.cond_txt + '"/>'
                        );
                        // 温度
                        $(".hours_tmp li").eq(index).text(index1.tmp + "℃");
                    }
                })
            },
            error: function (err) {
                console.log("err==>", err);
            }
        })
    }

    // 分钟级降雨
    function getRain(lon, lat) {
        // lon:经度
        // lat纬度
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/grid-minute',
            data: {
                location: lon + "," + lat,
                key: '6992992d312147da88517c9affac45c9'
            },
            success: res => {
                console.log("res==>", res);
                $(".rain").text(res.HeWeather6[0].grid_minute_forecast.txt);
            },
            error: error => {
                console.log("error==>", error);
            }
        })
    }
})()