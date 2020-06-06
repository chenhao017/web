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

    var data = {"OkPercent": 93.93939393939394, "KoPercent": 6.0606060606060606};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4175675675675676, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "/v1/otc/public/products "], "isController": false}, {"data": [0.25, 500, 1500, "用户交易"], "isController": false}, {"data": [0.35, 500, 1500, "/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 "], "isController": false}, {"data": [0.5, 500, 1500, "已取消订单列表"], "isController": false}, {"data": [0.45, 500, 1500, "/v1/markets/rates "], "isController": false}, {"data": [0.95, 500, 1500, "/v1/cfd/public/instruments "], "isController": false}, {"data": [0.7, 500, 1500, "btc广告主"], "isController": false}, {"data": [0.45, 500, 1500, "/v1/bid/public/loan/loss/sold "], "isController": false}, {"data": [0.0, 500, 1500, "C2C交易"], "isController": true}, {"data": [0.25, 500, 1500, "交割合约"], "isController": true}, {"data": [0.45, 500, 1500, "/v1/delivery/public/getDeliveryList "], "isController": false}, {"data": [0.475, 500, 1500, "最新成交"], "isController": false}, {"data": [0.3, 500, 1500, "usdt广告主"], "isController": false}, {"data": [0.0, 500, 1500, "/v1/aux/cms/news/pager?page=1&rows=20 "], "isController": false}, {"data": [0.675, 500, 1500, "/v1/markets/quotes "], "isController": false}, {"data": [0.0, 500, 1500, "注册邮箱发送验证码"], "isController": false}, {"data": [0.0, 500, 1500, "下单"], "isController": false}, {"data": [0.0, 500, 1500, "币币交易"], "isController": true}, {"data": [0.0, 500, 1500, "订单合约"], "isController": true}, {"data": [0.0, 500, 1500, "蜡烛图"], "isController": false}, {"data": [0.35, 500, 1500, "eth广告主"], "isController": false}, {"data": [0.4, 500, 1500, "/v1/spot/public/products "], "isController": false}, {"data": [0.85, 500, 1500, "用户资产"], "isController": false}, {"data": [0.3, 500, 1500, "加载用户信息"], "isController": false}, {"data": [0.5, 500, 1500, "用户安全"], "isController": false}, {"data": [0.5, 500, 1500, "未完成订单列表"], "isController": false}, {"data": [0.95, 500, 1500, "登录"], "isController": false}, {"data": [0.8, 500, 1500, "已完成订单列表"], "isController": false}, {"data": [0.25, 500, 1500, "/v1/bid/public/loan/loss/provision "], "isController": false}, {"data": [0.675, 500, 1500, "社区 "], "isController": false}, {"data": [0.4, 500, 1500, "/v1/aux/cms/news/categories "], "isController": false}, {"data": [0.05, 500, 1500, "注册邮箱校验"], "isController": false}, {"data": [0.45, 500, 1500, "用户设置"], "isController": false}, {"data": [0.6, 500, 1500, "用户KYC"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 330, 20, 6.0606060606060606, 1852.8969696969698, 139, 51975, 3714.100000000002, 6568.0999999999985, 19426.129999999997, 1.510497960827753, 8.56928218590797, 0.9364175479811966], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["/v1/otc/public/products ", 10, 0, 0.0, 836.3, 376, 3546, 3329.300000000001, 3546.0, 3546.0, 2.818489289740699, 3.4322813909244645, 1.706507187147689], "isController": false}, {"data": ["用户交易", 10, 0, 0.0, 1879.5, 606, 4761, 4647.200000000001, 4761.0, 4761.0, 2.0981955518254303, 1.8748524706252623, 1.272440857112883], "isController": false}, {"data": ["/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 ", 10, 0, 0.0, 1702.1, 565, 7589, 7077.4000000000015, 7589.0, 7589.0, 1.3175230566534915, 0.9868556488801055, 0.844038208168643], "isController": false}, {"data": ["已取消订单列表", 10, 0, 0.0, 838.0, 372, 1665, 1657.2, 1665.0, 1665.0, 6.002400960384154, 4.753854666866747, 3.675298244297719], "isController": false}, {"data": ["/v1/markets/rates ", 10, 0, 0.0, 811.2, 401, 1639, 1631.6, 1639.0, 1639.0, 6.090133982947624, 5.328867235079172, 3.651701431181486], "isController": false}, {"data": ["/v1/cfd/public/instruments ", 10, 0, 0.0, 251.9, 185, 752, 697.5000000000002, 752.0, 752.0, 13.280212483399735, 23.045837483399733, 8.079660524568393], "isController": false}, {"data": ["btc广告主", 10, 0, 0.0, 1061.8000000000002, 381, 3958, 3789.2000000000007, 3958.0, 3958.0, 2.5163563160543534, 3.8052517142677402, 1.6513588324106692], "isController": false}, {"data": ["/v1/bid/public/loan/loss/sold ", 10, 0, 0.0, 1285.1000000000001, 439, 3652, 3578.3, 3652.0, 3652.0, 2.737476047084588, 2.2803389337530797, 1.673496099096633], "isController": false}, {"data": ["C2C交易", 10, 0, 0.0, 9246.199999999999, 3389, 34274, 31842.200000000008, 34274.0, 34274.0, 0.28759598516004714, 2.1731752484110323, 1.0936511388801011], "isController": true}, {"data": ["交割合约", 10, 0, 0.0, 2468.2999999999997, 837, 6958, 6799.400000000001, 6958.0, 6958.0, 0.3800547278808148, 2.889752061796899, 0.47135693789905747], "isController": true}, {"data": ["/v1/delivery/public/getDeliveryList ", 10, 0, 0.0, 5959.0, 392, 51975, 46963.70000000002, 51975.0, 51975.0, 0.1924001924001924, 0.27939363876863876, 0.11874699374699374], "isController": false}, {"data": ["最新成交", 20, 0, 0.0, 1285.25, 378, 6497, 1894.9000000000003, 6267.399999999997, 6497.0, 0.539548937088594, 1.0055948695640444, 0.3285241819089242], "isController": false}, {"data": ["usdt广告主", 10, 0, 0.0, 1370.1000000000004, 906, 2457, 2402.9, 2457.0, 2457.0, 4.07000407000407, 9.467528998778999, 2.6749147842897845], "isController": false}, {"data": ["/v1/aux/cms/news/pager?page=1&rows=20 ", 10, 0, 0.0, 10506.1, 4462, 18338, 17956.4, 18338.0, 18338.0, 0.5453157378121932, 43.85419577857454, 0.33762712673137746], "isController": false}, {"data": ["/v1/markets/quotes ", 20, 0, 0.0, 784.65, 166, 3576, 1761.400000000001, 3487.299999999999, 3576.0, 0.22985863693828296, 0.38325111696931385, 0.1380498649580508], "isController": false}, {"data": ["注册邮箱发送验证码", 10, 10, 100.0, 693.0, 428, 1649, 1549.3000000000004, 1649.0, 1649.0, 6.0569351907934585, 4.483551635372502, 3.957118791641429], "isController": false}, {"data": ["下单", 10, 10, 100.0, 1973.1, 447, 7329, 7157.500000000001, 7329.0, 7329.0, 1.363884342607747, 14.601820359383524, 0.9150278743862521], "isController": false}, {"data": ["币币交易", 10, 0, 0.0, 23200.800000000003, 10126, 67286, 63228.30000000002, 67286.0, 67286.0, 0.1471345545501361, 13.562616098359449, 0.894302214375046], "isController": true}, {"data": ["订单合约", 10, 0, 0.0, 9223.2, 2985, 26694, 25517.500000000004, 26694.0, 26694.0, 0.3746160185809545, 21.85277180733498, 0.6976491674158988], "isController": true}, {"data": ["蜡烛图", 10, 0, 0.0, 7192.7, 2293, 25289, 24077.900000000005, 25289.0, 25289.0, 0.39541320680110714, 20.222489435053383, 0.24790554567022538], "isController": false}, {"data": ["eth广告主", 10, 0, 0.0, 2346.9, 400, 9590, 9197.300000000001, 9590.0, 9590.0, 1.0427528675703859, 1.4859228362877999, 0.6843065693430657], "isController": false}, {"data": ["/v1/spot/public/products ", 10, 0, 0.0, 992.4, 563, 1841, 1813.2, 1841.0, 1841.0, 5.431830526887561, 6.471516838674633, 3.294108161325367], "isController": false}, {"data": ["用户资产", 10, 0, 0.0, 688.1999999999999, 321, 1463, 1457.5, 1463.0, 1463.0, 6.83526999316473, 10.539932928913192, 4.165242652084757], "isController": false}, {"data": ["加载用户信息", 10, 0, 0.0, 1505.3, 453, 3091, 3018.4, 3091.0, 3091.0, 3.2351989647363313, 4.666395381753477, 1.9398556292461986], "isController": false}, {"data": ["用户安全", 10, 0, 0.0, 988.6999999999999, 458, 2983, 2848.8, 2983.0, 2983.0, 3.348961821835231, 3.9899740455458805, 2.0276917280643], "isController": false}, {"data": ["未完成订单列表", 10, 0, 0.0, 2925.7, 441, 19915, 18097.600000000006, 19915.0, 19915.0, 0.5021340697966357, 0.35600520964097415, 0.3054975834797891], "isController": false}, {"data": ["登录", 10, 0, 0.0, 452.9000000000001, 322, 1094, 1025.9, 1094.0, 1094.0, 9.107468123861567, 7.595486111111111, 5.727743624772313], "isController": false}, {"data": ["已完成订单列表", 10, 0, 0.0, 703.7, 376, 2648, 2497.4000000000005, 2648.0, 2648.0, 3.776435045317221, 2.990907052492447, 2.312328880287009], "isController": false}, {"data": ["/v1/bid/public/loan/loss/provision ", 10, 0, 0.0, 2270.0, 603, 8744, 8267.000000000002, 8744.0, 8744.0, 1.143379830779785, 1.086434155613995, 0.7045631574434027], "isController": false}, {"data": ["社区 ", 20, 0, 0.0, 964.1500000000001, 139, 3467, 2750.300000000002, 3436.3999999999996, 3467.0, 0.5983545250560958, 3.3110216436050863, 0.37630890052356025], "isController": false}, {"data": ["/v1/aux/cms/news/categories ", 10, 0, 0.0, 989.5, 552, 2112, 2063.8, 2112.0, 2112.0, 4.73260766682442, 5.2964535021296735, 2.883932796971131], "isController": false}, {"data": ["注册邮箱校验", 10, 0, 0.0, 2742.6, 1255, 3945, 3926.2000000000003, 3945.0, 3945.0, 2.5214321734745333, 2.097910363086233, 1.605443141704488], "isController": false}, {"data": ["用户设置", 10, 0, 0.0, 1340.3000000000002, 444, 5643, 5267.4000000000015, 5643.0, 5643.0, 1.7714791851195748, 1.4808458813108947, 1.069115367581931], "isController": false}, {"data": ["用户KYC", 10, 0, 0.0, 771.4, 445, 1289, 1282.9, 1289.0, 1289.0, 7.739938080495356, 6.386960623065015, 4.671173568111455], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 10, 50.0, 3.0303030303030303], "isController": false}, {"data": ["429", 10, 50.0, 3.0303030303030303], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 330, 20, "500", 10, "429", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["注册邮箱发送验证码", 10, 10, "429", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["下单", 10, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
