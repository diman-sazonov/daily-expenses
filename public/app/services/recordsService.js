app.factory("recordsService", function($http) {

    function SelectedRecords() {

        Object.defineProperty(this, "length", {
            enumerable: false,
            get: function() {
                return Object.keys(this).length;
            }
        });
        
        Object.defineProperty(this, "single", {
            enumerable: false,
            get: function() {
                
                if (this.length == 1) {
                    
                    var id = Object.keys(this)[0];
                    return this[id];
                    
                }
                
                return false;
                
            }
        });
        
    }

    SelectedRecords.prototype = new function() {

        this.constructor = SelectedRecords;

        this.addRecord = function(record) {

            this[record.id] = record;

        };

        this.removeAll = function() {

            for (var id in this) {
                if (this.hasOwnProperty(id)) {
                    delete this[id];
                }
            }

        };

        
        
    };

    function Records() {

        Object.defineProperty(this, "loading", {
            enumerable: false,
            writable: true,
            value: false
        });

    }

    Records.prototype = new function() {

        this.constructor = Records;

        var selectedRecords = new SelectedRecords();

        Object.defineProperty(this, "selected", {
            get: function() {

                selectedRecords.removeAll();

                for (var id in this) {
                    if (this.hasOwnProperty(id)) {
                        if (this[id].selected) {
                            selectedRecords.addRecord(this[id]);
                        }
                    }
                }

                return selectedRecords;

            }
        });

        this.addRecord = function(data, callback) {
            
            $http.post("/api/records/add", {
                timestamp: data.timestamp,
                category_id: data.category_id,
                money: data.money,
                description: data.description
            }).success(function(record) {

                callback(null, record);

            }).error(function(err) {

                callback(err);

            });
            
        };

        this.getRecordsByCategoryIds = function(categoryIds, period, callback) {
            
            var _self = this;

            _self.loading = true;

            $http.get("/api/records/get/categoryIds", {
                params: {
                    categoryIds: categoryIds,
                    start: period.start || null,
                    end: period.end || null
                }
            }).success(function(data) {

                for (var id in _self) {
                    if (_self.hasOwnProperty(id)) {
                        delete _self[id];
                    }
                }
                       
                data.forEach(function(item) {

                    _self[item._id] = new Record({
                        id: item._id,
                        category_id: item.category_id,
                        timestamp: item.timestamp,
                        description: item.description,
                        money: item.money,
                        selected: false
                    });
            
                });

                _self.loading = false;
                callback(null, _self);
                       
            }).error(function(err) {

                _self.loading = false;
                callback(err);
            
            });
            
            
        };
        
        this.updateRecord = function(record, params, callback) {

            var _self = this;

            $http.post("/api/records/update/" + record.id, params).success(function(record) {

                _self[record.id].category_id = record.category_id;
                _self[record.id].description = record.description;
                _self[record.id].money = record.money;
                _self[record.id].timestamp = record.timestamp;

                callback(null, record);
                
            }).error(function(err) {

                callback(err);

            });
            
        };
        
        this.moveRecords = function(records, category_id, callback) {

            var records_ids = Object.keys(records);
            
            $http.post("/api/records/moveToCategory/" + category_id, {
                records_ids: records_ids
            }).success(function(result) {

                for (var id in records) {
                    if (records.hasOwnProperty(id)) {
                        records[id].category_id = category_id;
                    }
                }

                callback(null, records);

            }).error(function(err) {

                callback(err);

            });
            
        };

    };

    function Record(data) {

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }

    }
    
    return {
        expenses: new Records(),
        earnings: new Records()
    };

});