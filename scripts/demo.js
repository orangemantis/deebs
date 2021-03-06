var tn = "great_books";// table names

/**Configuration options
 * by default opts.easyMode is set to true. 
 * Set to false if you want to get Deebs style response objects returned from methods.
 */
var opts = {
    superUser: true,
    user: "librarian",
    debug: true,
    easyMode: false
};

//Set options
$db.setOptions(opts);

//Create a table
$db.createTable(tn);

var book1 = {
        title: "Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        rating: 10       
};

//add a record
$db.addRecord(tn, book1);

/**
 *remove the same record by id, yup it is zero based, 
 * we are programmers and this is javascript. When in Rome ... 
 */
$db.removeRecord(tn, "0");

//add a bunch of records at once.
var moreBooks = [{
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    rating: 9.5,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "A Wrinkle in Time",//Duplicate
    author: "Madeleine L'Engle",
    rating: 9.5,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
},{
    title: "A Man of the People",
    author: "Chinua Achebe",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Hitchhiker's Guide to the Galaxy",//duplicate
    author: "Douglas Adams",
    rating: 10,
    genre: "fiction",
    recommended: true,
    instock: true
}, {
    title: "Adventures of Tom Sawyer",
    author: "Mark Twain",
    rating: 9.5,
    genre: "fiction",
    recommended: false,
    instock: true
}];

//
$db.addRecords(tn, moreBooks);

//Get all the records from a table.
var books = $db.getRecords(tn, "*");
console.log("books", books);

//Get a selection (2,3,4,5) of records.
var otherBooks = $db.getRecords(tn, "2", "5");
console.log("other books", otherBooks);

//Find by a record property.
var criteria = {author: "Chinua Achebe"};
var achebeBooks = $db.selectRecords(tn, criteria);
console.log("books by Achebe", achebeBooks);

//Find records similar to others
var goodBook = $db.getRecord(tn, "1");

var similarBooks = $db.getLikeRecords(tn, goodBook);
console.log("similar books", similarBooks);
//Find unique records
var uniqueBooks = $db.getUnique(tn);
console.log("unique books", uniqueBooks);

//Remove Duplicate records
$db.deDupe(tn);
books = $db.getRecords(tn, "*");
console.log("books (deduped)", books);

var bookUpdate = {recommended: true, note: "This is a must read for all middle school students."};

var updatedRecord = $db.updateRecord(tn, "7", bookUpdate);
console.log("updated record", updatedRecord);

/**
 * Extend deebs by adding custom methods.
 */
var getBookTitles = function(tableName){
    var response = this.getRecords(tableName, "*");
    var bookList = [];
    if (!response.error) {
        var books = response.results;
        for (var i = 0; i < books.length; i++) {
            if (books[i]) {
                var bookName = books[i].title || " Name not provided.";
                bookList.push(bookName);
            }
        }
    }
    return bookList;
};

$db.extend(getBookTitles,"getBooksList");
var bookTitles = $db.getBooksList(tn);
console.log("book titles", bookTitles);

//Create custom methods that use Deebs style responses
var getBookTitles2 = function(tableName){
    //Import system object
    var sys = this.getSystem();
    var response = this.getRecords(tableName, "*");
    var bookList = [];
    if (!response.error) {
        var books = response.results;
        for (var i = 0; i < books.length; i++) {
            if (books[i]) {
                var bookName = books[i].title || " Name not provided.";
                bookList.push(bookName);
            }
        }
    }
    var message = "Success, books list provided.";
    //Just wrap the return value in a response
    var response = sys.response.wrap(bookList, message);
    return response;
};

$db.extend(getBookTitles2,"getBooksList2");
var bookTitles2 = $db.getBooksList2(tn);
console.log("book titles", bookTitles2);