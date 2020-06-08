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

    var data = {"OkPercent": 89.58823529411765, "KoPercent": 10.411764705882353};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8776470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "获取用户历史跟单统计信息记录集"], "isController": false}, {"data": [1.0, 500, 1500, "/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 "], "isController": false}, {"data": [0.76, 500, 1500, "删除用户自己的跟单记录"], "isController": false}, {"data": [1.0, 500, 1500, "用户资产内部划转(如：币币->法币或法币->币币等)"], "isController": false}, {"data": [1.0, 500, 1500, "平仓"], "isController": false}, {"data": [1.0, 500, 1500, "创建用户跟单记录"], "isController": false}, {"data": [1.0, 500, 1500, "获取某一交易业务的币种列表"], "isController": false}, {"data": [1.0, 500, 1500, "修改用户相关配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户某一业务某一币种的提现地址列表"], "isController": false}, {"data": [1.0, 500, 1500, "最新成交"], "isController": false}, {"data": [0.91, 500, 1500, "开仓"], "isController": false}, {"data": [1.0, 500, 1500, "获取我的跟单统计信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户某一业务某一币种的充值地址"], "isController": false}, {"data": [1.0, 500, 1500, "获取某一交易业务的某一币种支持的站内划转的业务列表(如：币币->法币或合约等)"], "isController": false}, {"data": [1.0, 500, 1500, "拉取开仓信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取我的跟单记录(我跟随别人)"], "isController": false}, {"data": [0.0, 500, 1500, "注册邮箱发送验证码"], "isController": false}, {"data": [1.0, 500, 1500, "获取所有交易业务的币种列表"], "isController": false}, {"data": [1.0, 500, 1500, "分页查询用户某一业务某一币种的提现记录列表"], "isController": false}, {"data": [1.0, 500, 1500, "分页查询用户某一业务某一币种的充值记录列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户某一业务的所有币种的相关信息及余额"], "isController": false}, {"data": [1.0, 500, 1500, "分页查询用户某一业务某一币种的转账记录列表"], "isController": false}, {"data": [1.0, 500, 1500, "启用或关闭用户跟单功能"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户跟单相关收益指标"], "isController": false}, {"data": [0.46, 500, 1500, "修改用户跟单记录"], "isController": false}, {"data": [0.59, 500, 1500, "用户资产"], "isController": false}, {"data": [0.0, 500, 1500, "获取别人跟我的跟单记录(别人跟随我)"], "isController": false}, {"data": [1.0, 500, 1500, "加载用户信息"], "isController": false}, {"data": [1.0, 500, 1500, "用户安全"], "isController": false}, {"data": [1.0, 500, 1500, "社区 "], "isController": false}, {"data": [0.12, 500, 1500, "注册邮箱校验"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户某一业务某一币种的余额"], "isController": false}, {"data": [1.0, 500, 1500, "获取用户某一业务某一币种的提现限额信息"], "isController": false}, {"data": [1.0, 500, 1500, "用户KYC"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 177, 10.411764705882353, 140.38235294117646, 5, 958, 281.9000000000001, 674.3499999999976, 891.94, 255.79295817032803, 290.7473127633163, 158.38650598104124], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["获取用户历史跟单统计信息记录集", 50, 0, 0.0, 142.34, 71, 171, 166.9, 168.45, 171.0, 285.7142857142857, 400.9486607142857, 168.52678571428572], "isController": false}, {"data": ["/v1/asset/accounts/spot/pdc/transfer-records?page=1&rows=20 ", 50, 0, 0.0, 159.16000000000005, 62, 236, 229.0, 234.0, 236.0, 210.08403361344537, 157.35786502100842, 129.25091911764707], "isController": false}, {"data": ["删除用户自己的跟单记录", 50, 12, 24.0, 211.61999999999998, 64, 305, 298.9, 303.45, 305.0, 161.81229773462783, 149.55944073624596, 119.4629854368932], "isController": false}, {"data": ["用户资产内部划转(如：币币->法币或法币->币币等)", 50, 0, 0.0, 39.239999999999995, 10, 80, 75.8, 78.44999999999999, 80.0, 531.9148936170212, 389.0666555851064, 360.4970079787234], "isController": false}, {"data": ["平仓", 50, 0, 0.0, 67.68, 15, 120, 109.9, 114.24999999999997, 120.0, 406.5040650406504, 297.0258511178862, 250.0952743902439], "isController": false}, {"data": ["创建用户跟单记录", 50, 0, 0.0, 307.02, 137, 500, 411.6, 496.45, 500.0, 98.23182711198427, 101.68337119351669, 71.27563236738703], "isController": false}, {"data": ["获取某一交易业务的币种列表", 50, 0, 0.0, 12.8, 7, 18, 16.0, 17.0, 18.0, 2500.0, 3703.61328125, 1469.7265625], "isController": false}, {"data": ["修改用户相关配置信息", 50, 0, 0.0, 58.62, 35, 80, 77.0, 79.0, 80.0, 602.4096385542169, 770.6607680722891, 385.33038403614455], "isController": false}, {"data": ["获取用户某一业务某一币种的提现地址列表", 50, 0, 0.0, 47.38000000000001, 11, 69, 68.0, 69.0, 69.0, 609.7560975609756, 472.2036966463414, 365.6154725609756], "isController": false}, {"data": ["最新成交", 50, 0, 0.0, 44.50000000000001, 19, 54, 51.9, 52.0, 54.0, 909.090909090909, 1528.7642045454545, 528.2315340909091], "isController": false}, {"data": ["开仓", 50, 0, 0.0, 353.4800000000001, 79, 548, 526.5, 539.45, 548.0, 90.57971014492753, 65.28108016304347, 64.57342617753622], "isController": false}, {"data": ["获取我的跟单统计信息", 50, 0, 0.0, 42.34, 38, 46, 45.0, 45.0, 46.0, 1020.4081632653061, 1305.404974489796, 593.9094387755101], "isController": false}, {"data": ["获取用户某一业务某一币种的充值地址", 50, 0, 0.0, 82.88, 40, 105, 102.0, 103.44999999999999, 105.0, 467.2897196261682, 399.2954147196262, 279.7349591121495], "isController": false}, {"data": ["获取某一交易业务的某一币种支持的站内划转的业务列表(如：币币->法币或合约等)", 50, 0, 0.0, 40.85999999999999, 11, 57, 55.9, 56.449999999999996, 57.0, 769.2307692307693, 558.1430288461538, 468.75], "isController": false}, {"data": ["拉取开仓信息", 50, 0, 0.0, 70.47999999999999, 47, 94, 91.69999999999999, 93.44999999999999, 94.0, 515.4639175257731, 825.0442976804123, 319.6480347938144], "isController": false}, {"data": ["获取我的跟单记录(我跟随别人)", 50, 0, 0.0, 15.280000000000001, 13, 23, 17.0, 18.449999999999996, 23.0, 2173.9130434782605, 1628.311820652174, 1297.1297554347827], "isController": false}, {"data": ["注册邮箱发送验证码", 50, 50, 100.0, 115.59999999999998, 54, 157, 149.9, 154.45, 157.0, 284.0909090909091, 210.29385653409093, 193.92533735795456], "isController": false}, {"data": ["获取所有交易业务的币种列表", 50, 0, 0.0, 52.600000000000016, 47, 60, 57.0, 58.449999999999996, 60.0, 819.672131147541, 944.5440573770492, 481.87756147540983], "isController": false}, {"data": ["分页查询用户某一业务某一币种的提现记录列表", 50, 0, 0.0, 133.38, 110, 158, 152.9, 157.0, 158.0, 308.641975308642, 231.18007330246914, 185.06462191358025], "isController": false}, {"data": ["分页查询用户某一业务某一币种的充值记录列表", 50, 0, 0.0, 157.61999999999998, 134, 188, 185.0, 187.45, 188.0, 255.10204081632654, 191.0774075255102, 152.71245216836735], "isController": false}, {"data": ["获取用户某一业务的所有币种的相关信息及余额", 50, 0, 0.0, 101.74000000000001, 25, 159, 152.0, 158.0, 159.0, 285.7142857142857, 337.48883928571433, 167.96875], "isController": false}, {"data": ["分页查询用户某一业务某一币种的转账记录列表", 50, 0, 0.0, 107.74000000000001, 26, 158, 140.9, 150.24999999999997, 158.0, 299.4011976047904, 224.25851422155688, 179.52376497005986], "isController": false}, {"data": ["启用或关闭用户跟单功能", 50, 0, 0.0, 41.199999999999996, 26, 59, 57.9, 58.0, 59.0, 735.2941176470589, 940.6594669117646, 440.1711856617647], "isController": false}, {"data": ["获取用户跟单相关收益指标", 50, 0, 0.0, 48.58, 42, 55, 52.9, 53.0, 55.0, 877.1929824561403, 657.0381030701755, 525.1165021929825], "isController": false}, {"data": ["修改用户跟单记录", 50, 27, 54.0, 123.88000000000004, 56, 222, 168.0, 217.59999999999997, 222.0, 224.2152466367713, 196.12265274663676, 165.53391255605382], "isController": false}, {"data": ["用户资产", 50, 0, 0.0, 635.86, 336, 736, 729.6, 735.0, 736.0, 67.65899864682002, 105.58503890392423, 39.51179803788904], "isController": false}, {"data": ["获取别人跟我的跟单记录(别人跟随我)", 50, 50, 100.0, 12.9, 5, 32, 25.0, 27.349999999999987, 32.0, 1315.7894736842106, 967.5678453947369, 783.8199013157895], "isController": false}, {"data": ["加载用户信息", 50, 0, 0.0, 176.73999999999998, 84, 247, 240.2, 245.0, 247.0, 189.3939393939394, 272.99360795454544, 108.75355113636363], "isController": false}, {"data": ["用户安全", 50, 0, 0.0, 96.15999999999998, 30, 153, 132.7, 136.79999999999998, 153.0, 320.51282051282055, 381.86097756410254, 185.92247596153845], "isController": false}, {"data": ["社区 ", 50, 0, 0.0, 31.48, 16, 55, 46.9, 51.0, 55.0, 892.8571428571429, 4980.119977678572, 538.8532366071429], "isController": false}, {"data": ["注册邮箱校验", 50, 38, 76.0, 864.5999999999999, 795, 958, 930.8, 944.05, 958.0, 51.975051975051976, 35.99272349272349, 34.616196725571726], "isController": false}, {"data": ["获取用户某一业务某一币种的余额", 50, 0, 0.0, 57.58, 23, 95, 82.8, 88.69999999999997, 95.0, 510.2040816326531, 448.421556122449, 301.937181122449], "isController": false}, {"data": ["获取用户某一业务某一币种的提现限额信息", 50, 0, 0.0, 209.44, 137, 256, 248.5, 251.79999999999998, 256.0, 190.11406844106463, 151.86846482889734, 113.62286121673003], "isController": false}, {"data": ["用户KYC", 50, 0, 0.0, 110.21999999999998, 22, 179, 164.9, 175.7, 179.0, 264.55026455026456, 218.3056382275132, 152.9431216931217], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 39, 22.033898305084747, 2.2941176470588234], "isController": false}, {"data": ["405", 50, 28.24858757062147, 2.9411764705882355], "isController": false}, {"data": ["429", 88, 49.717514124293785, 5.176470588235294], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1700, 177, "429", 88, "405", 50, "400", 39, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["删除用户自己的跟单记录", 50, 12, "400", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["注册邮箱发送验证码", 50, 50, "429", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["修改用户跟单记录", 50, 27, "400", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["获取别人跟我的跟单记录(别人跟随我)", 50, 50, "405", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["注册邮箱校验", 50, 38, "429", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
