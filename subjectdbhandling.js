var subjectdb = require('./database');
exports.search = function(key, res) {
    console.log(key);
    subjectdb.query('use subjects;')
    subjectdb.query('SELECT name,id from subject WHERE name LIKE' + subjectdb.escape('%' + key + '%') + ';',
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "error": "error"
                })
            } else {
                res.send({
                    "result": results
                })
            }
        });
}