app.controller("expensesCtrl", function($scope, $rootScope, $http, $modal, categoriesService, recordsService) {
    
    $scope.category_type = "expenses";
    
    $scope.categories = categoriesService[$scope.category_type];
    $scope.records = recordsService[$scope.category_type];

    $scope.selectedRecords = new function() {

        this.items = {};

        this.addRecord = function(record) {
            this.items[record.id] = record;
        };

        this.removeRecordById = function(id) {
            delete this.items[id];
        };

        Object.defineProperty(this, "length", {
            get: function() {
                return Object.keys(this.items).length;
            }
        });

    };
    
    $scope.addingCategory = false;

    // setTimeout(function() {
    //     console.log($scope.categories);
    // }, 2000);

    $scope.newCategory = function() {

        $scope.addingCategory = !$scope.addingCategory;

    };

    $scope.updateCategory = function(category) {

        var upsertCategoryModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertCategory',
            controller: 'upsertCategoryCtrl',
            size: 'md',
            resolve: {
                category: function() {
                    return category;
                },
                edit_mode: function() {
                    return true;
                },
                category_type: function() {
                    return $scope.category_type;
                }
            }
        });

        upsertCategoryModalInstance.result.then(function (modalResult) {

            // OK button clicked
            if (modalResult.status_code == 410) { // 410 - Gone (удален)

                var category = $scope.categories.all[modalResult.category_id];
                
                if (category.parent) {

                    delete $scope.categories.all[category.parent.id].childs[category.id];

                } else {

                    delete $scope.categories[modalResult.category_id];

                }

                delete $scope.categories.all[modalResult.category_id];

            } else if (modalResult.status_code == 200) { // 200 - OK (переименована)

                $scope.categories.all[modalResult.category.id].name = modalResult.category.name;
                
            }

        }, function (modalResult) {

            //Cancel button clicked

        });
    };
    
    $scope.addRecords = function() {

        var upsertRecordsModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertRecords',
            controller: 'upsertRecordsCtrl',
            size: 'md',
            windowClass: "right-modal",
            resolve: {
                countRecords: function() {
                    return 0;
                },
                edit_mode: function() {
                    return false;  
                },
                records: function() {
                    return null;
                },
                categories: function() {
                    return $scope.categories
                }
            }
        });

        upsertRecordsModalInstance.result.then(function (modalResult) {

            // OK button clicked

        }, function (modalResult) {

            // Cancel button clicked

        });
        
    };
    
    $scope.getRecords = function(category) {
        
        var ids = [category.id].concat(category.getChildsIds());

        $scope.records.getRecordsByCategoryIds(ids, $scope.categories.period, function(err, records) {

            if (err) return console.error(err);

            console.log(records);
            
        });

    };

    $scope.updateRecords = function() {
        
        var upsertRecordsModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertRecords',
            controller: 'upsertRecordsCtrl',
            size: 'md',
            windowClass: "right-modal",
            resolve: {
                countRecords: function() {
                    return $scope.selectedRecords.length;
                },
                edit_mode: function() {
                    return true;
                },
                records: function() {
                    return $scope.selectedRecords.items;
                },
                categories: function() {
                    return $scope.categories
                }
            }
        });
    
        upsertRecordsModalInstance.result.then(function(data) {

            // OK button clicked

        }, function (modalResult) {
    
            // Cancel button clicked
    
        });
    
    };

    $scope.selectRecord = function(record) {

        record.selected = !record.selected;

        if (record.selected) {

            $scope.selectedRecords.addRecord(record);

        } else {

            $scope.selectedRecords.removeRecordById(record.id);

        }

    };

    function init() {

    }

    // function upsertRecordsModalResult(records) {
    //
    //     for (var id in records) {
    //         if (records.hasOwnProperty(id)) {
    //
    //             $scope.categories.all[$scope.listRecords[id].category_id].moneyOfCategory -= $scope.listRecords[id].money;
    //             $scope.categories.all[$scope.listRecords[id].category_id].countRecords--;
    //
    //             console.log($scope.categories.period);
    //
    //             if ((!$scope.categories.period.start || $scope.categories.period.start <= records[id].timestamp) &&
    //                 (!$scope.categories.period.end || records[id].timestamp <= $scope.categories.period.end)) { // NOT moved to another time
    //
    //                 $scope.categories.all[records[id].category_id].moneyOfCategory += records[id].money;
    //                 $scope.categories.all[records[id].category_id].countRecords++;
    //
    //                 if (records[id].category_id != $scope.listRecords[id].category_id) { // moved in another category
    //                     delete $scope.listRecords[id];
    //                 } else {
    //                     $scope.listRecords[id] = records[id];
    //                     $scope.listRecords[id].selected = true;
    //                 }
    //
    //             } else {
    //                 delete $scope.listRecords[id];
    //             }
    //
    //         }
    //     }
    //
    // }

    init();
    
});