let fs = require('fs');
let request = require('graphql-request').request

// Build the query
const query = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    isPaidOnly
    difficulty
    likes
    dislikes
  }
}`;

// Flag rejected promises
function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "fulfilled" }},
                        function(e){ return {e:e, status: "rejected" }});
}

let output = [];
fs.readFile('data.json', 'utf8', function(err, contents) {

    let data = JSON.parse(contents);

    // For each problem, build a graphql query as a promise
    for (let q of data.stat_status_pairs) {

        let title = q.stat.question__title_slug;
        const variables = {"titleSlug":title};

        output.push(
            request('https://leetcode.com/graphql', query, variables)
        );
    }

    // Wait for all promises then write data to a file
    Promise.all(output.map(reflect)).then(function(values) {

        // Filter out failed promises
        values = values.filter((x) => x.status == "fulfilled").map((x) => x.v);

        fs.writeFile('output.json', JSON.stringify(values), function (err) {
            if (err) throw err;
            console.log('Done');
        });
    });
});
