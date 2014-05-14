;(function(options){
    
    if (!options) {
        options = {};
    }
    var deebs;
    var namespace = options.namespace || "deebs";
    var user = options.user || "admin";
    var debug = options.debug || false;
    var superUser = options.superUser || false;
    
    var db = {};
    var tables = {
            tableNames: [{
                name: "tableNames",
                owner: "root"
            }]
    };
    
    recordMetaData = {
            lock: "_" + namespace + "_lock",
            id: "_" + namespace + "_id"
    };
    
    function createDB(){
        var system = {};
        system.response = {
                getResponse: function(type){
                    var response = {};
                    
                    switch(type){
                    case "warn":
                        response.error = true;
                        response.errorType = "warn";
                        break;
                    case "error":
                        response.error = true;
                        response.errorType = "error";
                        break;
                    default://ok
                        response.error = false;
                        response.errorType = null;
                        break;
                    }
                    return response;
                }
        };
        
        system.setOptions = function(options){
            var response = this.data.isObject(options);
            if (!response.error) {
                response = this.data.isString(options.namesapce);
                if (!response.error) {
                    namespace = options.namespace || "deebs";
                }
                
                response = this.data.isString(options.user);
                if (!response.error) {
                    user = options.user || "admin";
                }
                
                response = this.data.isBoolean(options.superUser);
                if (!response.error) {
                    superUser = options.superUser || false;
                }
                
                response = this.data.isBoolean(options.debug);
                if (!response.error) {
                    debug = options.debug || false;
                }
                
                this.init();
                
                response = this.response.getResponse("ok");
                response.message = "Success, options set.";
                response.results = arguments;
            }
            return response;
        };
        system.init = function(){
            if (superUser) {
                this.initSuperUser();
            }
        };
        
        system.extend = function(newMethod, methodName){
            var response = this.data.isString(methodName);
            if (!response.error) {
                response = this.data.isFunction(newMethod);
                if (!response.error) {
                    if (!db[methodName]) {
                        db[methodName] = newMethod;
                    }
                    else if (superUser){
                        db[methodName] = newMethod;
                    }
                    else {
                        response = this.response.getResponse("error");
                        response.message = methodName +  " already exist.";
                        response.results = [methodName];
                    }
                }
            }
            return response;
        };
        
        system.initSuperUser = function(){
            db.getSystem = function(){
                    return system;
            };

            db.getTables = function(){
                    return tables;
            };
        };
        
        system.debug = {
                print: function(item, label){
                    if (debug && console) {
                        if (!label) {
                            label = "system debug: ";
                        }
                        console.log(label, item);
                    }
                },
                alert: function(item){
                    if (debug && alert) {
                        item = JSON.stringify(item);
                        alert(item);
                    }
                }
        };
        /**
         * returns {object} with results array that contains object type description.
         */
        system.data = {
                checktype: function(item){
                    var response = system.response.getResponse("ok");
                    try {
                        var itemType = Object.prototype.toString.call(item); 
                        var typeFound;
                        switch(itemType){
                            case "[object Array]":
                                typeFound = "array";
                                break;
                            case "[object Function]":
                                typeFound = "function";
                                break;
                            case "[object Null]":
                                typeFound = "null";
                                break;
                            case "[object Number]":
                                typeFound = "number";
                                break;
                            case "[object Object]":
                                typeFound = "object";
                                break;
                            case "[object RegExp]":
                                typeFound = "regexp";
                                break;
                            case "[object String]":
                                typeFound = "string";
                                break;
                            case "[object Boolean]":
                                typeFound = "boolean";
                                break;
                            default:
                                typeFound = "undefined";
                                break;
                        }
                        response.results = [typeFound];
                    }
                    catch(error){
                        response = system.response.getResponse("error");
                        response.message = error;
                    }
                    
                    return response;
                },
                isArray: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "array") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is an array.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "Item not is an array.";
                    }
                    response.results = [item];
                    return response;
                },
                isObject: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "object") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is an object.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "item is not an object.";
                    }
                    response.results = [item];
                    return response;
                },
                isString: function(item){
                	var response = this.checktype(item);
                    if (!response.error && response.results[0] === "string") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is a string.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "item is not a string.";
                    }
                    response.results = [item];
                    return response;
                },
                isNumber: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "number") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is a number.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "item is not a number.";
                    }
                    response.results = [item];
                    return response;
                },
                isFunction: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "function") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is a function.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "Item is not a function.";
                    }
                    response.results = [item];
                    return response;
                },
                isBoolean: function(item){
                    var response = this.checktype(item);
                    if (!response.error && response.results[0] === "boolean") {
                        response = system.response.getResponse("ok");
                        response.message = "Success, item is a boolean.";
                    }
                    else{
                        response = system.response.getResponse("error");
                        response.message = "item is not a boolean.";
                    }
                    response.results = [item];
                    return response;
                },
                areLikeNumbers: function(item1, item2){
                    var response = this.isNumber(item1);
                    if (!response.error) {
                        response = this.isNumber(item2);
                        if (!response.error) {
                            var score = 0;
                            if (item1 > item2) {
                                var item1Less = item1 - (item1 * 0.1);
                                if (item2 >= item1Less) {
                                    score += 100;
                                }
                            }
                            else{
                                var item2Less = item2 - (item2 + 0.1);
                                if (item1 >= item2Less) {
                                    score += 100;
                                }
                            }
                            if (score) {
                                response = system.response.getResponse("ok");
                                response.message = "The numbers are similar";
                                response.results = arguments;
                            }
                            else {
                                response = system.response.getResponse("error");
                                response.message = "The numbers are not similar";
                                response.results = arguments;
                            }
                        }
                    }
                    return response;
                },
                areLikeStrings: function(item1, item2){
                    var response = this.isString(item1);
                    if (!response.error) {
                        response = this.isString(item2);
                    }
                    if (!response.error) {
                        var score = 0;
                        var longestString = (item1.length > item2.length) ? item1 : item2;
                        var shortestString = (item1.length < item2.length) ? item1 : item2;
                        //test length
                        if (item1 === item2) {
                            score += 100;
                        }
                        else { 
                            if (item1.length === item2.length) {
                                score += 10;
                            }
                            else{
                                score += Math.floor((shortestString.length / longestString.length) * 10);
                            }
                          //test content similarity
                            var contentScore = 0;
                            var stringCounter = (shortestString.length < 100) ? shortestString.length : 100;
                            var contentScoreMax = 10 * stringCounter;
                            for (var j = 0; j < stringCounter; j++){
                                if (shortestString[j].toLowerCase() === longestString[j].toLowerCase()){
                                    contentScore += 10;
                                }
                            }
                            contentScore = Math.floor((contentScore / contentScoreMax) * 70);
                            score += contentScore;
                            contentScore = 0;
                            contentScoreMax = 100;
                            if(shortestString >= 6) {
                                var sliceSize = Math.floor(shortestString.length / 3);
                                var shortestStringSlice = (shortestString.slice(0, sliceSize)).toLowerCase();
                                var longestStringSlice = (longestString.slice(0, sliceSize)).toLowerCase();
                                
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 34;
                                }
                                shortestStringSlice = (shortestString.slice(0, sliceSize * 2)).toLowerCase();
                                longestStringSlice = (longestString.slice(0, sliceSize * 2)).toLowerCase();
                                
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 33;
                                }
                                shortestStringSlice = (shortestString.slice(0, sliceSize * 3)).toLowerCase();
                                longestStringSlice = (longestString.slice(0, sliceSize * 3)).toLowerCase();
                                
                                if (shortestStringSlice === longestStringSlice) {
                                    contentScore += 33;
                                }
                                contentScore = Math.floor((contentScore / contentScoreMax) * 20);
                                score += contentScore;
                            }
                        }
                        if (score > 74) {
                            response = system.response.getResponse("ok");
                            response.message = "Items are similar.";
                            response.results = arguments;
                        }
                        else{
                            response = system.response.getResponse("error");
                            response.message = "Items are not similar.";
                            response.results = arguments;
                        }
                    }
                    return response;
                },
                areLikeObjects: function(item1, item2){
                    var response = system.data.isObject(item1);
                    if (!response.error) {
                        response = system.data.isObject(item2);
                        if (!response.error) {
                            var paramCount = 0;
                            var score = 0;
                            for(var param in item1){
                                paramCount++;
                                if (item1[param] === item2[param]) {
                                    score += 10;
                                }
                            }
                            for(var param in item2){
                                paramCount++;
                                if (item2[param] === item1[param]) {
                                    score += 10;
                                }
                            }
                            score += Math.floor((score / (paramCount * 10)) *100);
                            if (score > 74) {
                                response = system.response.getResponse("ok");
                                response.message = "Objects are similar.";
                                response.results = arguments;
                            }
                            else{
                                response = system.response.getResponse("error");
                                response.message = "Objects are not similar.";
                                response.results = arguments;
                            }
                        }
                    }
                    return response;
                },
                areLikeArrays: function(item1, item2){
                    var response = system.data.isArray(item1);
                    if (!response.error) {
                        response = system.data.isArray(item2);
                        if (!response.error) {
                            var itemCount = 0;
                            var score = 0;
                            for(var i = 0; i < item1.length; i++){
                                itemCount++;
                                if (item1[i] === item2[i]) {
                                    score += 10;
                                }
                            }
                            for(var j = 0; j < item1.length; j++){
                                itemCount++;
                                if (item2[j] === item1[j]) {
                                    score += 10;
                                }
                            }
                            score += Math.floor((score / (itemCount * 10)) *100);
                            if (score > 74) {
                                response = system.response.getResponse("ok");
                                response.message = "Arrays are similar.";
                                response.results = arguments;
                            }
                            else{
                                response = system.response.getResponse("error");
                                response.message = "Arrays are not similar.";
                                response.results = arguments;
                            }
                        }
                    }
                    return response;
                },
                copy: function(item){
                    var response = this.isObject(item);
                    if (!response.error) {
                        var newItem = {};
                        for(var param in item){
                            newItem[param] = item[param];
                        }
                        response = system.response.getResponse("ok");
                        response.message = "Success, object created.";
                        response.results = [newItem];
                    }
                    return response;
                }
        };
        
        /**
         * @returns {array} of table names.
         */
        function getTableNames(){
            var tn = tables.tableNames;
            var counter = tn.length;
            var tableNames = [];
            for(var i = 0; i < counter; i++){
                tableNames.push(tn[i].name);
            }
            var response = system.response.getResponse("ok");
            response.results = tableNames;;
            return response;
        }
        /**
         * Checks if table name has been registered or is used by db.
         * @returns {object} that contains errors if any and {array} of table names.
         */
        function checkTableName(tableName){
            var tn = tables.tableNames;
            var counter = tn.length;
            var response = system.response.getResponse("ok");
            response.message = "This table name is ok.";
            for(var i = 0; i < counter ; i++) {
                if (tn[i]) {
                    if (tableName === tn[i].name) {
                        //check permissions to see if there should be a warning or a fail message
                        switch(tn[i].owner){
                            case "root":
                                if (superUser){
                                    response = system.response.getResponse("warn");
                                    response.message = "To use this table name enable superUser and configure the system manually. "
                                        + "This is not advised, nor documented.";
                                    counter = i;
                                }
                                else {
                                    response = system.response.getResponse("error");
                                    response.message = "Table name already in use.";
                                    counter = i;
                                }
                                break;
                            default:
                                response = system.response.getResponse("error");
                                response.message = "Table name already in use.";
                                counter = i;
                                break;
                        }
                    }
                }
            }
            response = getTableNames();
            return response;
        }
        /**
         * Checks only to see if table name exist, this is different from checkTablename that checks 
         * to see if tableName is available.
         * @returns {object} response from checking type and implicitly existence.
         */
        function checkTableExist(tableName){
            var response = system.data.isArray(tables[tableName]);
            return response;
        }
        
        function getTable(tableName){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response.results = tables[tableName];
            }
            return response;
        }
        
        /**
         * @returns  an object with basic table info
         */
        function getTableInfo(tableName){
            var response = checkTableExist(tableName);
            if (!response.error) {
                var table = tables;
                var tableInfo = {};
                tableInfo.rowCount = table[tableName].length;
                response = system.response.getResponse("ok");
                response.message = "Success, table info returned.";
                response.results = [tableInfo];
            }
            return response;
        }
        
        function getNewRecordId(tableName){
            var response = getTable(tableName);
            if (!response.error){
                var newRecordId = response.results.length;
                response.results = [newRecordId.toString()];
            }
            return response;
        }
        
        /**
         * Adds table entry on table object
         * @returns {object} response with table names;
         */
        function createTable(tableName){
            var response = checkTableName(tableName);
            if (!response.error) {
                var newTable = {
                        name: tableName,
                        owner:user
                };
                tables.tableNames.push(newTable);
                tables[tableName] = [];
                
                response = getTableNames();
            }
            return response;
        }
        
        function dropTable(tableName){
            var response = checkTableExist(tableName);
            if (!response.error) {
                if (tableName !== "tableNames"){
                    delete tables[tableName];
                    var newTableNames = [];
                    var tableNames = tables["tableNames"];
                    var counter = tableNames.length;
                    if (counter > 1) {
                        for (var i = 0; i < counter; i++) {
                            if (tableNames[i].name !== tableName) {
                                newTableNames.push(tableNames[i]);
                            }
                        }
                        tables["tableNames"] = newTableNames;
                        response = system.response.getResponse("ok");
                        response.message = "Success, table " + tableName + " removed";
                        response.results = [];
                    }
                }
                else {
                    response = system.response.getResponse("error");
                    response.message = "This table cannot be removed.";
                    response.results = [];
                }
            }
            return response;
        }
        /**
         *Handle any object level record cleanup here.
         */
        function initRecord(record, recordId, lock){
            var response = system.data.isObject(record);
            if (!response.error) {
            	if (!lock) {
            		lock = false;
            	}
            	
            	for(var param in record){
            	    response = system.data.isFunction(record[param]);
            	    if (!response.error) {
            	        delete record[param];
            	    }
            	}
            	
                record[recordMetaData.id] = recordId;
                record[recordMetaData.lock] = lock;
                response = system.response.getResponse("ok");
                response.message = "Success, record has been formatted.";
                response.results = [record]; 
            }
            return response;
        }
        
        /**
         * Formats and adds record to table if it exist.
         * @returns formatted record.
         */
        function addRecord(tableName, record, lock) {
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isObject(record);
                if (!response.error){
                    response = getNewRecordId(tableName);
                    if (!response.error) {
                    	var recordId = response.results[0];
                    	response = initRecord(record, recordId, false);
                    	if (!response.error) {
                            record = response.results[0];
                            response = system.data.copy(record);
                            if (!response.error) {
                                record = response.results[0];
                                tables[tableName].push(record);
                                response.message = "Success, record added to " + tableName + ".";
                            }
                        }
                    }
                }
            }
            return response;
        }
        
        function addRecords(tableName, records){
            system.debug.print(records, "records");
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isArray(records);
                if (!response.error) {
                    var counter = records.length;
                    if (counter > 0) {
                        if (!response.error) {
                            for(var i = 0; i < counter; i++){
                                response = addRecord(tableName, records[i]);
                            }
                        }
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "No records supplied.";
                        response.results = [];
                    }
                }
            }
            return response;
        }
        
        function getRecord(tableName, recordId){
        	var response = checkTableExist(tableName);
        	if (!response.error){
        		response = system.data.isString(recordId);
        		if (!response.error) {
        			recordId = parseFloat(recordId);
        			if (recordId || recordId === 0) {
        				var record = tables[tableName][recordId];
        				if (record) {
        				    response = system.data.copy(record);
        				    if (!response.error) { 
        				        record = response.results[0];
                                response = system.response.getResponse("ok");
                                response.results = [record];
                                response.message = "Success, record found.";
        				    }
        				}
        				else {
        					response = system.response.getResponse("error");
        					response.message = "The record could not be found.";
        				}
        			}
        			else {
        				response = system.response.getResponse("error");
        				response.message = "the record ID is improperly formatted.";
        			}
        		}
        	}
        	return response;
        }
        
        function removeRecord(tableName, recordId){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isString(recordId);
                if (!response.error) {
                    recordId = parseFloat(recordId);
                    if (recordId || recordId === 0) {
                        var record = tables[tableName][recordId];
                        if (record) {
                            if(!record[recordMetaData.lock]) {
                                tables[tableName][recordId] = null;
                                response = system.response.getResponse("ok");
                                response.results = [record];
                                response.message = "Success, record removed.";
                            }
                            else {
                                response = system.response.getResponse("error");
                                response.message = "The record is locked and cannot be removed.";
                            }
                        }
                        else {
                            response = system.response.getResponse("error");
                            response.message = "The record could not be found.";
                        }
                    }
                }
            }
            return response;
        }
        
        function getRecords(tableName, start, stop){
            var response = checkTableExist(tableName);
            var records = [];
            if (!response.error) {
                response = system.data.isString(start);
                if (!response.error) {
                    if (start === "*") {
                        records = tables[tableName];
                        response.message = "Success, all records retreived.";
                        response.results = records;
                    }
                    else{
                        response = system.data.isString(stop);
                        if (!response.error) {
                            var start = parseFloat(start);
                            var stop = parseFloat(stop) + 1;
                            if ((start || start === 0) && stop <= tables[tableName].length) {
                                if (stop > start) {
                                    var counter = stop;
                                    for(var i = start; i < counter; i++){
                                        response =  system.data.copy(tables[tableName][i]);
                                        if (!response.error) {
                                            var record = response.results[0];
                                            records.push(record);
                                        }
                                    }
                                    response.message = "Success, " + records.length + " retreived.";
                                    response.results = records;
                                }
                                else {
                                    response = system.response.getResponse("error");
                                    error.message = "Invalid range specified.";
                                }
                            }
                            else {
                                response = system.response.getResponse("error");
                                error.message = "Invalid range specified.";
                            }
                        }
                    }
                }
            }
            return response;
        }
        
        function getCollection(tableName, collection){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isArray(collection);
                    var counter = collection.length;
                    var records = [];
                    if (counter > 0){
                        for(var i = 0; i < counter; i++){
                           var index = parseFloat(collection[i]);
                           if (index || index === 0) {
                               var response = getRecord(tableName, collection[i]);
                               if (!response.error) {
                                   records.push(response.results[0]);
                               }
                           }
                        }
                        if (records.length > 0){
                            response = system.response.getResponse("ok");
                            response.message = "Success, records found.";
                            response.results = records;
                        }
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "No collection supplied.";
                    }
                }
            return response;
        }
        
        function selectRecords(tableName, criteria){
            var response = checkTableExist(tableName);
            var records = [];
            if (!response.error) {
                response = system.data.isObject(criteria);
                if (!response.error) {
                    var counter = tables[tableName].length;
                    if (counter > 0) {
                        for(var i = 0; i < counter; i++){
                            var record = tables[tableName][i];
                            var matches = 0;
                            var properties = 0;
                            if (record) {
                                for(var param in criteria) {
                                    properties++;
                                    var recordParam = record[param];
                                    if (recordParam) {
                                        if (recordParam === criteria[param]) {
                                            matches++;
                                        }
                                    }
                                }
                            }
                            if (matches === properties) {
                                response = system.data.copy(record);
                                if (!response.error) {
                                    records.push(record);
                                }
                            }
                        }
                        if (records.length > 0) {
                            response.message = "Success " + records.length + " records found.";
                            response.results = records;
                        }
                        else {
                            response.message = "No records found.";
                            response.results = records;
                        }
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "The table is empty.";
                    }
                }
            }
            return response;
        }
        
        function getLikeRecords(tableName, record){
            var response = checkTableExist(tableName);
            if (!response.error) {
                response = system.data.isObject(record);
                if (!response.error) {
                    response = getRecords(tableName, "*");
                    if (!response.error){
                        var records = response.results;
                        var matches = [];
                        if (records.length > 0) {
                            for(var i = 0; i < records.length; i++){
                                response = system.data.areLikeObjects(record, records[i]);
                                if (!response.error) {
                                    response = system.data.copy(record);
                                    if (!response.error) {
                                        matches.push(records[i]);
                                    }
                                }
                            }
                        }
                        else{
                            response = system.response.getResponse("ok");
                            response.message = "No like records found.";
                        }
                        if (matches.length > 0){
                            response = system.response.getResponse("ok");
                            response.message = matches.length + " like records found.";
                            response.results = matches;
                        }
                    }
                }
            }
            return response;
        }
        
        function getUnique(tableName, dedupe){
            var response = checkTableExist(tableName);
            if (!response.error) {
                var records = tables[tableName];
                var counter = records.length;
                if (counter > 0) {
                    var unique = [];
                    var removed = [];
                    for(var i = 0; i < counter; i++){
                        response = system.data.copy(records[i]);
                        if (!response.error) {
                            var record = response.results[0];
                            delete record[recordMetaData.id];
                            delete record[recordMetaData.lock];
                            response = selectRecords(tableName, record);
                            if (!response.error) {
                                if (response.results.length === 1) {
                                    response = system.data.copy(records[i]);
                                    if (!response.error) {
                                        unique.push(response.results[0]);
                                    }
                                }
                                else {
                                    if (dedupe === true) {
                                        response = system.data.copy(records[i]);
                                        if (!response.error) {
                                            removed.push(response.results[0]);
                                        }
                                        records[i] = null;
                                    }
                                }
                            }
                        }
                    }
                    if (unique.length > 0) {
                        response = system.response.getResponse("ok");
                        var dedupeMessage = "Success, duplicate records removed.";
                        var message = "Success, " + unique.length + " unique records found.";
                        response.message = (dedupe === true) ? dedupeMessage : message;
                        response.results = (dedupe === true) ? removed : unique;
                    }
                    else {
                        response = system.response.getResponse("error");
                        response.message = "No unique record found.";
                        response.results = unique;
                    }
                }
                else {
                    response = system.response.getResponse("error");
                    response.message = "Table contains no records.";
                    response.results = [];
                }
            }
            return response;
        }
        
        function updateRecord(tableName, recordId, update, unlock){
            var response = getRecord(tableName, recordId);
            var record;
            if (!response.error) {
                record = response.results[0];
                if (record[recordMetaData.lock] && !unlock) {
                    response = system.response.getResponse("error");
                    response.message = "This record cannot be updated because it is locked.";
                    response.results = [recordId];
                    return response;
                }
            }
            
            response = system.data.isObject(update);
            
            if (!response.error && record) {
                for (var param in update) {
                    response = system.data.isFunction(update[param]);
                    if (response.error) {
                        record[param] = update[param];
                    }
                }
                
                var recordIndex = parseFloat(recordId);
                
                if (recordIndex || recordIndex === 0) {
                    tables[tableName][recordIndex] = record;
                    response = system.response.getResponse("ok");
                    response.message = "Success, record " + recordId + " updated.";
                    response.results = [record];
                }
            }
            return response;
        }
        /**
         * saves the db to localStorage for later between page refreshes and different sessions.
         */
        function pickle(){
            var response = getTableNames();
            if (!response.error) {
                var tableNames = response.results;
                for (var i = 0; i < tableNames.length; i++){
                    response = getTable(tableNames[i]);
                    if(!response.error) {
                        var table = JSON.stringify(response.results);
                        var tableName = namespace + "_" + tableNames[i];
                        localStorage.setItem(tableName, table);
                    }
                }
                response = system.response.getResponse("ok");
                response.message = "Success, database pickled.";
                response.results = [];
            }
            return response;
        }
        
        function unPickle(){
            var tableNames = namespace + "_" +"tableNames";
            tableNames = JSON.parse(localStorage.getItem(tableNames));
            
            var response = system.data.isArray(tableNames);
            
            if (!response.error) {
                for(var i = 0; i < tableNames.length; i++) {
                    var tableName = namespace + "_" + tableNames[i].name;
                    var table = localStorage.getItem(tableName);
                    if (table) {
                        tableName = tableName.replace((namespace + "_"), "");
                        alert(tableName);
                        tables[tableName] = JSON.parse(table);
                    }
                }
                response = system.response.getResponse("ok");
                response.message = "Success, database unpickled.";
                response.results = [tables];
            }
        
           return response; 
        }
        
        /**
         * External API for db
         */
        
        db.getTableNames = function(){
            var response =  getTableNames();
            return response;
        };
        
        db.checkTableName = function(tableName){
            var response = checkTableName(tableName);
            return response;
        };
        
        db.createTable = function(tableName){
            var response = createTable(tableName);
            return response;
        };
        
        db.dropTable = function(tableName) {
            var response = dropTable(tableName);
            return response;
        };
        
        db.addRecord = function(tableName, record, lock){
            var response = addRecord(tableName, record, lock);
            return response;
        };
        
        db.getRecord = function(tableName, recordId){
        	var response = getRecord(tableName, recordId);
            return response;
        };
        
        db.removeRecord = function(tableName, recordId){
            var response = removeRecord(tableName, recordId);
            return response;
        };
        
        db.getRecords = function(tableName, start, stop) {
            var response = getRecords(tableName, start, stop);
            return response;
        };
        
        db.selectRecords = function(tableName, criteria) {
            var response = selectRecords(tableName, criteria);
            return response;
        };
        
        db.getLikeRecords = function(tableName, record){
            var response = getLikeRecords(tableName, record);
            return response;
        };
        
        db.pickle = function(){
            var response = pickle();
            return response;
        };
        
        db.unPickle = function(){
            var response = unPickle();
            return response;
        };
        
        db.getTableInfo = function(tableName){
            var response = getTableInfo(tableName);
            return response;
        };
        
        db.addRecords = function(tableName, records){
            var response = addRecords(tableName, records);
            return response;
        };
        
        db.getCollection = function(tableName, collection){
            var response = getCollection(tableName, collection);
            return response;
        };
        
        db.getUnique = function(tableName){
            var response = getUnique(tableName, false);
            return response;
        };
        
        db.deDupe = function(tableName){
            var response = getUnique(tableName, true);
            return response;
        };
        
        db.updateRecord = function(tableName, recordId, update){
            var response = updateRecord(tableName, recordId, update);
            return response;
        };
        
        db.lockRecord = function(tableName, recordId){
            var update = {};
            update[recordMetaData.lock] = true;
            var response = updateRecord(tableName, recordId, update);
            return response;
        };
        
        db.unlockRecord = function(tableName, recordId){
            var update = {};
            update[recordMetaData.lock] = false;
            var response = updateRecord(tableName, recordId, update, true);
            return response;
        };
        
        db.setOptions = function(options){
            var response = system.setOptions(options);
            return response;
        };
        
        db.extend = function(newMethod, methodName){
            var response = system.extend(newMethod, methodName);
            return response;
        };
        
        system.init();

        return db;
    };
    
    if (!deebs) {
         deebs = createDB();
    }
    if (window) {
        window.$db = deebs;
    }
    return deebs;
})();