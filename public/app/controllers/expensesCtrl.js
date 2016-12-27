app.controller("expensesCtrl", function($scope, $rootScope, $http, $modal, categoriesService, recordsService) {
    
    $scope.category_type = "expenses";
    
    $scope.categories = categoriesService[$scope.category_type];
    $scope.records = recordsService[$scope.category_type];
    
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

        upsertCategoryModalInstance.result.then(function(modalResult) {

            console.log(modalResult);
            
            /*
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
            */
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
                type: function() {
                    return $scope.category_type
                }
            }
        });

        upsertRecordsModalInstance.result.then(function(record) {

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
                type: function() {
                    return $scope.category_type;
                }
            }
        });
    
        upsertRecordsModalInstance.result.then(function(resultModal) {

            // OK button clicked

            if (resultModal.record) {

                console.log(resultModal, $scope.categories);

                if ($scope.categories.checkCurrentTimestamp(resultModal.oldParams.timestamp)) {
                    $scope.categories.all[resultModal.oldParams.category_id].moneyOfCategory -= resultModal.oldParams.money;
                    $scope.categories.all[resultModal.oldParams.category_id].countRecords--;
                }

                if ($scope.categories.checkCurrentTimestamp(resultModal.record.timestamp)) {
                    $scope.categories.all[resultModal.record.category_id].moneyOfCategory += resultModal.record.money;
                    $scope.categories.all[resultModal.oldParams.category_id].countRecords++;
                }

            } else if (resultModal.records) {

                console.log(resultModal);

                for (var id in resultModal.oldRecords) {
                    var record = resultModal.oldRecords[id];
                    if ($scope.categories.checkCurrentTimestamp(record.timestamp)) {
                        $scope.categories.all[record.category_id].moneyOfCategory -= record.money;
                    }
                }

                for (var id in resultModal.records) {
                    if (resultModal.records.hasOwnProperty(id)) {
                        var record = resultModal.records[id];
                        if ($scope.categories.checkCurrentTimestamp(record.timestamp)) {
                            $scope.categories.all[record.category_id].moneyOfCategory += record.money;
                        }
                    }
                }

            }


        }, function (modalResult) {
    
            // Cancel button clicked
    
        });
        

    };

    $scope.selectRecord = function(record) {

        record.selected = !record.selected;
        
    };

    function init() {

    }

    init();
    
});