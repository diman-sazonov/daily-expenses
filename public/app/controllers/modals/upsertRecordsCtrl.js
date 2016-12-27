app.controller('upsertRecordsCtrl', function($scope, $rootScope, $modalInstance, $http, $timeout, type, categoriesService, recordsService) {

    $scope.days = [];
    $scope.months = Date.calendar.months;
    $scope.years = [2015, 2016, 2017];

    $scope.loading = false;

    $scope.type = type;

    $scope.categories = categoriesService[type];
    $scope.records = recordsService[type];

    $scope.edit_mode = $scope.records.selected.length > 0;

    $scope.newData = {
        selectDay: 0,
        selectMonth: 0,
        selectYear: 0,
        money: 0,
        description: "",
        categoryId: ""
    };

    $scope.addRecord = function() {

        $scope.loading = true;

        var timestamp = new Date(
            $scope.newData.selectYear,
            $scope.newData.selectMonth,
            $scope.newData.selectDay
        ).getTime();

        var data = {
            timestamp: timestamp,
            category_id: $scope.newData.categoryId,
            money: $scope.newData.money,
            description: $scope.newData.description || ""
        };

        $scope.records.addRecord(data, function(err, record) {

            $scope.loading = false;

            if (err) return console.error(err);

            if ($scope.categories.checkCurrentTimestamp(record.timestamp)) {
                $scope.categories.all[record.category_id].moneyOfCategory += record.money;
                $scope.categories.all[record.category_id].countRecords++;
            }

            $scope.newData.money = "";
            $scope.newData.description = "";

            console.log(record);

        });

    };

    $scope.moveRecords = function() {

        $scope.loading = true;
        
        var oldRecords = JSON.parse(JSON.stringify($scope.records.selected));

        $scope.records.moveRecords($scope.records.selected, $scope.newData.categoryId, function(err, records) {

            $scope.loading = false;

            if (err) return console.error(err);

            $modalInstance.close({
                oldRecords: oldRecords,
                records: records,
                status_code: 200
            });

        });

    };
    
    $scope.updateRecord = function() {

        $scope.loading = true;

        var record = $scope.records.selected.single;

        var oldParams = {
            money: record.money,
            description: record.description,
            category_id: record.category_id,
            timestamp: record.timestamp
        };
        
        var timestamp = new Date(
            $scope.newData.selectYear,
            $scope.newData.selectMonth,
            $scope.newData.selectDay
        ).getTime();

        var params = {
            money: +$scope.newData.money,
            description: $scope.newData.description || "",
            category_id: $scope.newData.categoryId,
            timestamp: timestamp
        };

        $scope.records.updateRecord(record, params, function(err, record) {

            $scope.loading = false;

            if (err) return console.error(err);

            $modalInstance.close({
                oldParams: oldParams,
                record: record,
                status_code: 200
            });

        });

    };
        
    $scope.close = function() {

        $modalInstance.dismiss("Cancel");

    };

    function init() {

        for (var i = 1; i <= 31; i++) {
            $scope.days[i-1] = i;
        }

        if ($scope.records.selected.length == 1) {

            var record_id = Object.keys($scope.records.selected)[0];

            var dateOfRecord = new Date($scope.records[record_id].timestamp);

            $scope.newData = {
                selectDay: dateOfRecord.getDate().toString(),
                selectMonth: dateOfRecord.getMonth().toString(),
                selectYear: dateOfRecord.getFullYear().toString(),
                money: $scope.records[record_id].money,
                description: $scope.records[record_id].description,
                categoryId: $scope.records[record_id].category_id
            };

        } else {

            var date = new Date();

            $scope.newData = {
                selectDay: date.getDate().toString(),
                selectMonth: date.getMonth().toString(),
                selectYear: date.getFullYear().toString(),
                money: "",
                description: "",
                categoryId: Object.keys($scope.categories.all)[0]
            };

        }

    }

    init();

});