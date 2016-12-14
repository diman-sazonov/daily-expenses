app.directive("selectPeriod", function() {
    return {
        templateUrl: "/templates/directives/selectPeriod",
        scope: {
            expenses: "=",
            earnings: "="
        },
        controller: "selectPeriodDirectiveCtrl"
    };
});

app.directive("blockLoading", function() {
    return {
        templateUrl: "/templates/directives/blockLoading",
        scope: {
            loading: "="
        }
    }
});

app.directive("newCategory", function() {
    return {
        templateUrl: "/templates/directives/newCategory",
        scope: {
            parent: "=",
            adding: "=",
            depth: "=",
            type: "="
        },
        controller: "newCategoryDirectiveCtrl"
    };
});