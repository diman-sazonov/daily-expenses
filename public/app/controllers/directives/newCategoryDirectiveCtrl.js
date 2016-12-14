app.controller("newCategoryDirectiveCtrl", function($scope, $timeout, $modal, categoriesService) {

    $scope.categories = categoriesService[$scope.type];

    $scope.newCategory = function(parent) {


        var addCategoryModalInstance = $modal.open({
            animation: true,
            templateUrl: '/modals/upsertCategory',
            controller: 'upsertCategoryCtrl',
            size: 'md',
            resolve: {
                category: function() {
                    return $scope.parent || null
                },
                edit_mode: function() {
                    return false;
                },
                category_type: function() {
                    return $scope.type;
                }
            }
        });

        addCategoryModalInstance.result.then(function(category) {

            // OK button clicked
            $scope.categories.addCategory(category);

        }, function(modalResult) {

            //Cancel button clicked

        });

    };
    
});