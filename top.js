let fs = require("fs");

// Read data file
fs.readFile('output.json', 'utf8', function(err, contents) {

    let data = JSON.parse(contents);

    // Filter by "Easy"
    data = data.filter(x => x.question.difficulty == "Easy")

    // Sort by number of likes
    data.sort((a, b) => b.question.likes - a.question.likes);

    // Print top 10 results
    let n = 1;
    for (let obj of data) {

        console.log(n, obj.question.title + " ("+ obj.question.difficulty +")");
        console.log("Likes:", obj.question.likes, "\nDislikes:", obj.question.dislikes);
        console.log("https://leetcode.com/problems/" + obj.question.titleSlug);
        console.log("");

        if (n >= 10) break
        n += 1;
    }
});
