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

    var data = {"OkPercent": 62.5, "KoPercent": 37.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "计划单开仓"], "isController": false}, {"data": [0.0, 500, 1500, "跟单操作"], "isController": false}, {"data": [0.5, 500, 1500, "跟单列表"], "isController": false}, {"data": [0.5, 500, 1500, "平仓"], "isController": false}, {"data": [1.0, 500, 1500, "被跟单人信息"], "isController": false}, {"data": [0.5, 500, 1500, "拉取已平仓列表"], "isController": false}, {"data": [0.0, 500, 1500, "登录"], "isController": false}, {"data": [0.5, 500, 1500, "市价单开仓"], "isController": false}, {"data": [1.0, 500, 1500, "社区 "], "isController": false}, {"data": [1.0, 500, 1500, "被跟单列表"], "isController": false}, {"data": [0.5, 500, 1500, "计划委托列表"], "isController": false}, {"data": [1.0, 500, 1500, "最新成交"], "isController": false}, {"data": [0.5, 500, 1500, "拉取开仓信息"], "isController": false}, {"data": [0.5, 500, 1500, "撤单"], "isController": false}, {"data": [0.5, 500, 1500, "用户账单"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 320, 120, 37.5, 311.4468749999998, 78, 3834, 349.90000000000003, 3117.75, 3744.0, 57.2348417098909, 41.037982360042925, 39.2546335628689], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["计划单开仓", 20, 10, 50.0, 90.9, 80, 103, 102.80000000000001, 103.0, 103.0, 75.18796992481202, 32.784598214285715, 59.32800751879699], "isController": false}, {"data": ["跟单操作", 20, 20, 100.0, 87.30000000000001, 78, 95, 93.80000000000001, 94.95, 95.0, 52.35602094240838, 22.956888089005236, 39.21588678010471], "isController": false}, {"data": ["跟单列表", 20, 10, 50.0, 87.45, 79, 95, 94.0, 94.95, 95.0, 50.377833753148614, 22.679864609571787, 33.10965050377833], "isController": false}, {"data": ["平仓", 20, 10, 50.0, 88.89999999999998, 81, 101, 97.7, 100.85, 101.0, 88.1057268722467, 39.01947962555066, 59.109994493392065], "isController": false}, {"data": ["被跟单人信息", 20, 0, 0.0, 87.1, 80, 95, 93.7, 94.95, 95.0, 54.200542005420054, 43.0322662601626, 35.62203590785908], "isController": false}, {"data": ["拉取已平仓列表", 20, 10, 50.0, 88.1, 81, 97, 95.0, 96.9, 97.0, 82.3045267489712, 68.47993827160494, 53.690843621399175], "isController": false}, {"data": ["登录", 20, 0, 0.0, 3386.05, 2845, 3834, 3764.7000000000003, 3830.65, 3834.0, 5.185377236193933, 2.683837827326938, 3.605457609541094], "isController": false}, {"data": ["市价单开仓", 20, 10, 50.0, 94.15000000000002, 79, 120, 112.30000000000001, 119.64999999999999, 120.0, 106.95187165775401, 46.634776069518715, 82.72058823529412], "isController": false}, {"data": ["社区 ", 20, 0, 0.0, 350.29999999999995, 318, 367, 366.8, 367.0, 367.0, 48.07692307692308, 49.250676081730774, 31.926081730769234], "isController": false}, {"data": ["被跟单列表", 20, 0, 0.0, 86.30000000000001, 80, 93, 90.0, 92.85, 93.0, 55.865921787709496, 57.22983589385475, 37.09846368715084], "isController": false}, {"data": ["计划委托列表", 40, 20, 50.0, 89.17499999999998, 79, 98, 97.0, 98.0, 98.0, 83.16008316008316, 66.06516372141373, 56.360446985446984], "isController": false}, {"data": ["最新成交", 20, 0, 0.0, 88.6, 82, 94, 92.9, 93.95, 94.0, 126.58227848101266, 171.3310917721519, 81.21538765822785], "isController": false}, {"data": ["拉取开仓信息", 20, 10, 50.0, 89.7, 79, 99, 98.9, 99.0, 99.0, 97.08737864077669, 85.70995145631069, 66.0838895631068], "isController": false}, {"data": ["撤单", 20, 10, 50.0, 88.15, 80, 97, 96.80000000000001, 97.0, 97.0, 66.006600660066, 29.232415429042906, 44.34818481848185], "isController": false}, {"data": ["用户账单", 20, 10, 50.0, 91.80000000000001, 79, 104, 103.9, 104.0, 104.0, 57.971014492753625, 46.84669384057971, 37.76041666666667], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401", 110, 91.66666666666667, 34.375], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;code&quot;: 0,\/", 10, 8.333333333333334, 3.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 320, 120, "401", 110, "Test failed: text expected to contain \/&quot;code&quot;: 0,\/", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["计划单开仓", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["跟单操作", 20, 20, "401", 10, "Test failed: text expected to contain \/&quot;code&quot;: 0,\/", 10, null, null, null, null, null, null], "isController": false}, {"data": ["跟单列表", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["平仓", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["拉取已平仓列表", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["市价单开仓", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["计划委托列表", 40, 20, "401", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["拉取开仓信息", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["撤单", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["用户账单", 20, 10, "401", 10, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
