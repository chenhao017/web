/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 93.14285714285714, "KoPercent": 6.857142857142857};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4013888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 500, 1500, "获取用户历史跟单统计信息记录集"], "isController": false}, {"data": [0.2, 500, 1500, "/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 "], "isController": false}, {"data": [0.45, 500, 1500, "删除用户自己的跟单记录"], "isController": false}, {"data": [0.3, 500, 1500, "用户资产内部划转(如：币币->法币或法币->币币等)"], "isController": false}, {"data": [0.25, 500, 1500, "平仓"], "isController": false}, {"data": [0.25, 500, 1500, "创建用户跟单记录"], "isController": false}, {"data": [0.5, 500, 1500, "获取某一交易业务的币种列表"], "isController": false}, {"data": [0.95, 500, 1500, "修改用户相关配置信息"], "isController": false}, {"data": [0.3, 500, 1500, "获取用户某一业务某一币种的提现地址列表"], "isController": false}, {"data": [0.2, 500, 1500, "最新成交"], "isController": false}, {"data": [0.35, 500, 1500, "开仓"], "isController": false}, {"data": [0.55, 500, 1500, "获取我的跟单统计信息"], "isController": false}, {"data": [0.8, 500, 1500, "获取用户某一业务某一币种的充值地址"], "isController": false}, {"data": [0.55, 500, 1500, "获取某一交易业务的某一币种支持的站内划转的业务列表(如：币币->法币或合约等)"], "isController": false}, {"data": [0.25, 500, 1500, "拉取开仓信息"], "isController": false}, {"data": [0.5, 500, 1500, "获取我的跟单记录(我跟随别人)"], "isController": false}, {"data": [0.0, 500, 1500, "注册邮箱发送验证码"], "isController": false}, {"data": [0.25, 500, 1500, "获取所有交易业务的币种列表"], "isController": false}, {"data": [0.65, 500, 1500, "分页查询用户某一业务某一币种的提现记录列表"], "isController": false}, {"data": [0.3, 500, 1500, "分页查询用户某一业务某一币种的充值记录列表"], "isController": false}, {"data": [0.3, 500, 1500, "获取用户某一业务的所有币种的相关信息及余额"], "isController": false}, {"data": [0.15, 500, 1500, "分页查询用户某一业务某一币种的转账记录列表"], "isController": false}, {"data": [1.0, 500, 1500, "启用或关闭用户跟单功能"], "isController": false}, {"data": [0.2, 500, 1500, "获取用户跟单相关收益指标"], "isController": false}, {"data": [0.0, 500, 1500, "订单合约"], "isController": true}, {"data": [0.45, 500, 1500, "修改用户跟单记录"], "isController": false}, {"data": [0.35, 500, 1500, "用户资产"], "isController": false}, {"data": [0.0, 500, 1500, "获取别人跟我的跟单记录(别人跟随我)"], "isController": false}, {"data": [0.35, 500, 1500, "加载用户信息"], "isController": false}, {"data": [0.3, 500, 1500, "用户安全"], "isController": false}, {"data": [0.4, 500, 1500, "登录"], "isController": false}, {"data": [0.8, 500, 1500, "社区 "], "isController": false}, {"data": [0.3, 500, 1500, "注册邮箱校验"], "isController": false}, {"data": [0.6, 500, 1500, "获取用户某一业务某一币种的余额"], "isController": false}, {"data": [0.4, 500, 1500, "获取用户某一业务某一币种的提现限额信息"], "isController": false}, {"data": [0.55, 500, 1500, "用户KYC"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 350, 24, 6.857142857142857, 1574.022857142858, 153, 27030, 3155.6000000000054, 4582.0499999999965, 17237.000000000062, 1.6831454622398339, 1.9082520789852078, 1.0361864251913977], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["获取用户历史跟单统计信息记录集", 10, 0, 0.0, 811.0, 471, 1833, 1812.5, 1833.0, 1833.0, 5.446623093681917, 7.643356821895424, 3.212656590413943], "isController": false}, {"data": ["/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 ", 10, 0, 0.0, 2644.1, 865, 6633, 6414.000000000001, 6633.0, 6633.0, 1.5076134479119554, 1.1292378071762401, 0.927535617367707], "isController": false}, {"data": ["删除用户自己的跟单记录", 10, 0, 0.0, 1647.3999999999999, 413, 6077, 5809.300000000001, 6077.0, 6077.0, 1.6452780519907866, 1.6213379709608422, 1.2146779368213227], "isController": false}, {"data": ["用户资产内部划转(如：币币->法币或法币->币币等)", 10, 0, 0.0, 1213.3, 521, 3579, 3426.4000000000005, 3579.0, 3579.0, 2.7917364600781687, 2.04200254745952, 1.89205576493579], "isController": false}, {"data": ["平仓", 10, 0, 0.0, 1685.5, 624, 5855, 5483.700000000001, 5855.0, 5855.0, 1.7079419299743808, 1.2542698548249358, 1.0507845858240819], "isController": false}, {"data": ["创建用户跟单记录", 10, 0, 0.0, 1837.2, 621, 5587, 5390.1, 5587.0, 5587.0, 1.7895490336435218, 1.845297680297065, 1.2984716132784537], "isController": false}, {"data": ["获取某一交易业务的币种列表", 10, 0, 0.0, 1041.4, 427, 2331, 2262.2000000000003, 2331.0, 2331.0, 4.288164665523157, 6.352681442967411, 2.5209718053173242], "isController": false}, {"data": ["修改用户相关配置信息", 10, 0, 0.0, 265.2, 158, 865, 801.5000000000002, 865.0, 865.0, 11.547344110854503, 14.693544312933026, 7.38624061778291], "isController": false}, {"data": ["获取用户某一业务某一币种的提现地址列表", 10, 0, 0.0, 1537.5, 677, 5610, 5213.500000000002, 5610.0, 5610.0, 1.7825311942959001, 1.3804172237076648, 1.0688224153297683], "isController": false}, {"data": ["最新成交", 10, 0, 0.0, 1569.8, 600, 4305, 4101.200000000001, 4305.0, 4305.0, 2.3228803716608595, 4.044624709639954, 1.3497205284552847], "isController": false}, {"data": ["开仓", 10, 0, 0.0, 1213.6, 505, 3294, 3131.8000000000006, 3294.0, 3294.0, 3.0349013657056148, 2.1872628983308045, 2.163552731411229], "isController": false}, {"data": ["获取我的跟单统计信息", 10, 0, 0.0, 972.3, 464, 1659, 1658.4, 1659.0, 1659.0, 6.024096385542169, 7.66542733433735, 3.5062123493975905], "isController": false}, {"data": ["获取用户某一业务某一币种的充值地址", 10, 0, 0.0, 658.7, 387, 2234, 2112.7000000000007, 2234.0, 2234.0, 4.476275738585497, 3.8249426477170996, 2.679645534914951], "isController": false}, {"data": ["获取某一交易业务的某一币种支持的站内划转的业务列表(如：币币->法币或合约等)", 10, 0, 0.0, 953.6, 449, 3017, 2829.8000000000006, 3017.0, 3017.0, 3.3123550844650547, 2.403398269294468, 2.0184663795958926], "isController": false}, {"data": ["拉取开仓信息", 10, 0, 0.0, 1765.2, 617, 6267, 5883.100000000001, 6267.0, 6267.0, 1.5956598053295037, 2.36699926200734, 0.9894960706877293], "isController": false}, {"data": ["获取我的跟单记录(我跟随别人)", 10, 0, 0.0, 1577.9, 425, 9577, 8733.800000000003, 9577.0, 9577.0, 1.0441683199331733, 0.7821065443249452, 0.6230340268351259], "isController": false}, {"data": ["注册邮箱发送验证码", 10, 10, 100.0, 1040.2, 442, 3645, 3579.9, 3645.0, 3645.0, 2.7427317608337907, 2.0302643307734503, 1.722242697476687], "isController": false}, {"data": ["获取所有交易业务的币种列表", 10, 0, 0.0, 1534.6000000000001, 590, 3171, 3118.7000000000003, 3171.0, 3171.0, 3.1525851197982346, 3.6328617591424965, 1.8533752364438838], "isController": false}, {"data": ["分页查询用户某一业务某一币种的提现记录列表", 10, 0, 0.0, 915.0, 485, 2160, 2114.1000000000004, 2160.0, 2160.0, 4.6274872744099955, 3.4660964252660804, 2.774684752429431], "isController": false}, {"data": ["分页查询用户某一业务某一币种的充值记录列表", 10, 0, 0.0, 1310.6, 597, 2212, 2165.9, 2212.0, 2212.0, 4.520795660036167, 3.3861819055153703, 2.7062966207052437], "isController": false}, {"data": ["获取用户某一业务的所有币种的相关信息及余额", 10, 0, 0.0, 1969.1999999999998, 549, 6658, 6428.1, 6658.0, 6658.0, 1.5010507355148606, 1.7753149861152808, 0.882453655058541], "isController": false}, {"data": ["分页查询用户某一业务某一币种的转账记录列表", 10, 0, 0.0, 3798.2, 1139, 13954, 13170.300000000003, 13954.0, 13954.0, 0.7166403898523721, 0.5367804482585639, 0.42970429625913714], "isController": false}, {"data": ["启用或关闭用户跟单功能", 10, 0, 0.0, 198.5, 153, 227, 226.5, 227.0, 227.0, 44.05286343612335, 56.055547907488986, 26.371489537444933], "isController": false}, {"data": ["获取用户跟单相关收益指标", 10, 0, 0.0, 3507.0, 657, 20654, 18870.90000000001, 20654.0, 20654.0, 0.48412083656080557, 0.3626178531661503, 0.2898106179802479], "isController": false}, {"data": ["订单合约", 10, 0, 0.0, 6800.8, 2752, 15078, 14450.600000000002, 15078.0, 15078.0, 0.6630420368651372, 6.795533375878531, 2.0771863811165625], "isController": true}, {"data": ["修改用户跟单记录", 10, 0, 0.0, 1004.6, 617, 4165, 3832.800000000001, 4165.0, 4165.0, 2.400384061449832, 2.4730519383101295, 1.7721585453672586], "isController": false}, {"data": ["用户资产", 10, 0, 0.0, 4461.2, 488, 23864, 22664.600000000006, 23864.0, 23864.0, 0.4190412336573919, 0.6549156155715722, 0.24471353293664097], "isController": false}, {"data": ["获取别人跟我的跟单记录(别人跟随我)", 10, 10, 100.0, 1995.7, 544, 7595, 7192.000000000002, 7595.0, 7595.0, 1.3164823591363877, 0.9680773597946287, 0.7842326553449184], "isController": false}, {"data": ["加载用户信息", 10, 0, 0.0, 3749.0, 608, 27030, 24555.90000000001, 27030.0, 27030.0, 0.3699593044765076, 0.5336229421013688, 0.21243756936736957], "isController": false}, {"data": ["用户安全", 10, 0, 0.0, 1752.8000000000002, 725, 4752, 4554.200000000001, 4752.0, 4752.0, 2.1043771043771042, 2.5071680345117846, 1.220703125], "isController": false}, {"data": ["登录", 10, 0, 0.0, 1199.3, 576, 4919, 4660.1, 4919.0, 4919.0, 2.03210729526519, 1.6947457325746798, 1.2264085043690307], "isController": false}, {"data": ["社区 ", 10, 0, 0.0, 566.7, 159, 2313, 2192.1000000000004, 2313.0, 2313.0, 4.32152117545376, 24.068003187121867, 2.6081055531547106], "isController": false}, {"data": ["注册邮箱校验", 10, 4, 40.0, 1294.0, 998, 2038, 2029.5, 2038.0, 2038.0, 4.906771344455349, 3.722246074582925, 2.9996473258096175], "isController": false}, {"data": ["获取用户某一业务某一币种的余额", 10, 0, 0.0, 951.2, 394, 3557, 3371.2000000000007, 3557.0, 3557.0, 2.810567734682406, 2.4702255480607085, 1.663285202360877], "isController": false}, {"data": ["获取用户某一业务某一币种的提现限额信息", 10, 0, 0.0, 1568.5, 419, 4081, 4077.8, 4081.0, 4081.0, 2.450379808870375, 1.9574323082577798, 1.4644848076451848], "isController": false}, {"data": ["用户KYC", 10, 0, 0.0, 880.8, 444, 2154, 2104.4, 2154.0, 2154.0, 4.640371229698376, 3.829212587006961, 2.6827146171693736], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["405", 10, 41.666666666666664, 2.857142857142857], "isController": false}, {"data": ["429", 14, 58.333333333333336, 4.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 350, 24, "429", 14, "405", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["注册邮箱发送验证码", 10, 10, "429", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["获取别人跟我的跟单记录(别人跟随我)", 10, 10, "405", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["注册邮箱校验", 10, 4, "429", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
