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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.96875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "关闭分享交易活动"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/users/security/fiat "], "isController": false}, {"data": [1.0, 500, 1500, "/v1/users/profile "], "isController": false}, {"data": [1.0, 500, 1500, "计划单开仓"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 "], "isController": false}, {"data": [1.0, 500, 1500, "跟单列表"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/markets/rates "], "isController": false}, {"data": [1.0, 500, 1500, "/v1/cfd/public/instruments "], "isController": false}, {"data": [1.0, 500, 1500, "/v1/markets/quotes/btc/candles?granularity=15 "], "isController": false}, {"data": [1.0, 500, 1500, "平仓"], "isController": false}, {"data": [1.0, 500, 1500, "拉取已平仓列表"], "isController": false}, {"data": [1.0, 500, 1500, "带单收益"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/cfd/trade/positions?positionType=execute&page=1&pageSize=300 "], "isController": false}, {"data": [1.0, 500, 1500, "最新成交"], "isController": false}, {"data": [1.0, 500, 1500, "拉取开仓信息"], "isController": false}, {"data": [1.0, 500, 1500, "全部撤单"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/markets/quotes "], "isController": false}, {"data": [1.0, 500, 1500, "分享交易活动"], "isController": false}, {"data": [1.0, 500, 1500, "带单管理"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/cfd/public/btc/deals "], "isController": false}, {"data": [1.0, 500, 1500, "被跟单人信息"], "isController": false}, {"data": [1.0, 500, 1500, "全部平仓"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/asset/accounts/balances "], "isController": false}, {"data": [1.0, 500, 1500, "社区列表"], "isController": false}, {"data": [0.0, 500, 1500, "登录"], "isController": false}, {"data": [1.0, 500, 1500, "市价单开仓"], "isController": false}, {"data": [1.0, 500, 1500, "计划委托列表"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/users/kyc/details "], "isController": false}, {"data": [1.0, 500, 1500, "/v1/cfd/public/profit/statistics?page=1&rows=50 "], "isController": false}, {"data": [1.0, 500, 1500, "撤单"], "isController": false}, {"data": [1.0, 500, 1500, "用户账单"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 213.00156250000015, 78, 2798, 373.0, 387.94999999999993, 2783.0, 87.63521840339585, 72.14902052238806, 61.00874640558675], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["关闭分享交易活动", 20, 0, 0.0, 370.95000000000005, 325, 395, 392.3, 394.9, 395.0, 50.25125628140704, 49.61330087939698, 34.69495917085427], "isController": false}, {"data": ["/v1/users/security/fiat ", 20, 0, 0.0, 93.14999999999999, 85, 102, 99.9, 101.9, 102.0, 194.17475728155338, 141.45934466019418, 130.4611650485437], "isController": false}, {"data": ["/v1/users/profile ", 20, 0, 0.0, 103.60000000000001, 94, 112, 112.0, 112.0, 112.0, 176.99115044247787, 202.57190265486724, 117.87887168141593], "isController": false}, {"data": ["计划单开仓", 20, 0, 0.0, 124.30000000000001, 93, 154, 149.9, 153.8, 154.0, 128.2051282051282, 55.08814102564103, 105.16826923076923], "isController": false}, {"data": ["/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 ", 20, 0, 0.0, 94.39999999999999, 88, 104, 100.80000000000001, 103.85, 104.0, 190.47619047619045, 82.77529761904762, 134.67261904761907], "isController": false}, {"data": ["跟单列表", 20, 0, 0.0, 92.04999999999998, 83, 101, 100.0, 100.95, 101.0, 194.17475728155338, 88.93355582524272, 133.68476941747574], "isController": false}, {"data": ["/v1/markets/rates ", 20, 0, 0.0, 86.6, 78, 97, 91.9, 96.75, 97.0, 206.18556701030926, 99.46842783505154, 137.32280927835052], "isController": false}, {"data": ["/v1/cfd/public/instruments ", 20, 0, 0.0, 90.5, 82, 99, 98.0, 98.95, 99.0, 200.0, 205.46875, 134.9609375], "isController": false}, {"data": ["/v1/markets/quotes/btc/candles?granularity=15 ", 20, 0, 0.0, 381.5, 363, 397, 394.9, 396.9, 397.0, 50.25125628140704, 93.68129711055276, 34.842179648241206], "isController": false}, {"data": ["平仓", 20, 0, 0.0, 97.64999999999999, 90, 106, 103.9, 105.9, 106.0, 186.91588785046727, 82.23203855140187, 132.1553738317757], "isController": false}, {"data": ["拉取已平仓列表", 20, 0, 0.0, 95.35, 85, 106, 104.80000000000001, 105.95, 106.0, 186.91588785046727, 232.91471962616822, 127.77453271028038], "isController": false}, {"data": ["带单收益", 20, 0, 0.0, 92.0, 85, 99, 96.80000000000001, 98.9, 99.0, 200.0, 91.6015625, 138.0859375], "isController": false}, {"data": ["/v1/cfd/trade/positions?positionType=execute&page=1&pageSize=300 ", 20, 0, 0.0, 97.3, 89, 106, 103.9, 105.9, 106.0, 188.67924528301887, 184.99410377358492, 134.32340801886792], "isController": false}, {"data": ["最新成交", 20, 0, 0.0, 378.85, 367, 395, 391.7, 394.85, 395.0, 50.505050505050505, 68.01412563131314, 33.98240214646464], "isController": false}, {"data": ["拉取开仓信息", 20, 0, 0.0, 101.89999999999999, 92, 111, 109.80000000000001, 110.95, 111.0, 180.18018018018017, 176.66103603603602, 128.27280405405406], "isController": false}, {"data": ["全部撤单", 20, 0, 0.0, 92.75, 86, 101, 99.9, 100.95, 101.0, 196.078431372549, 82.33762254901961, 135.76133578431373], "isController": false}, {"data": ["/v1/markets/quotes ", 20, 0, 0.0, 94.19999999999999, 85, 103, 102.9, 103.0, 103.0, 192.30769230769232, 222.7313701923077, 128.2677283653846], "isController": false}, {"data": ["分享交易活动", 20, 0, 0.0, 95.44999999999999, 87, 103, 102.9, 103.0, 103.0, 192.30769230769232, 189.86628605769232, 132.77493990384616], "isController": false}, {"data": ["带单管理", 20, 0, 0.0, 94.1, 85, 102, 100.9, 101.95, 102.0, 194.17475728155338, 191.70964805825244, 130.84041262135923], "isController": false}, {"data": ["/v1/cfd/public/btc/deals ", 20, 0, 0.0, 90.95000000000002, 80, 101, 99.9, 100.95, 101.0, 196.078431372549, 256.5870098039216, 131.93167892156865], "isController": false}, {"data": ["被跟单人信息", 20, 0, 0.0, 95.05, 84, 106, 104.9, 105.95, 106.0, 186.91588785046727, 251.89836448598132, 128.68720794392524], "isController": false}, {"data": ["全部平仓", 20, 0, 0.0, 220.2, 196, 237, 235.9, 236.95, 237.0, 84.38818565400844, 35.43644514767933, 58.346518987341774], "isController": false}, {"data": ["/v1/asset/accounts/balances ", 20, 0, 0.0, 135.9, 120, 156, 153.60000000000002, 155.9, 156.0, 127.38853503184713, 149.4078423566879, 86.08678343949045], "isController": false}, {"data": ["社区列表", 20, 0, 0.0, 91.5, 83, 102, 98.9, 101.85, 102.0, 194.17475728155338, 199.8634708737864, 135.01213592233012], "isController": false}, {"data": ["登录", 20, 0, 0.0, 2777.4999999999995, 2766, 2798, 2792.8, 2797.75, 2798.0, 7.142857142857142, 3.8783482142857144, 4.966517857142858], "isController": false}, {"data": ["市价单开仓", 20, 0, 0.0, 157.89999999999998, 96, 198, 194.8, 197.85, 198.0, 99.50248756218906, 42.754975124378106, 80.068407960199], "isController": false}, {"data": ["计划委托列表", 40, 0, 0.0, 95.77499999999998, 86, 105, 102.9, 104.94999999999999, 105.0, 125.39184952978056, 57.43044670846395, 88.90086206896551], "isController": false}, {"data": ["/v1/users/kyc/details ", 20, 0, 0.0, 92.29999999999998, 85, 104, 98.0, 103.69999999999999, 104.0, 190.47619047619045, 101.74851190476191, 127.60416666666667], "isController": false}, {"data": ["/v1/cfd/public/profit/statistics?page=1&rows=50 ", 20, 0, 0.0, 86.8, 81, 97, 92.0, 96.75, 97.0, 200.0, 91.6015625, 139.0625], "isController": false}, {"data": ["撤单", 20, 0, 0.0, 94.85, 87, 104, 102.80000000000001, 103.95, 104.0, 188.67924528301887, 83.65271226415095, 133.58637971698113], "isController": false}, {"data": ["用户账单", 20, 0, 0.0, 104.95, 94, 114, 113.0, 113.95, 114.0, 173.91304347826087, 205.50271739130434, 118.71603260869564], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 640, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
