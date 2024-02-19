let data1 = [75, 50, 100, 25, 150]
let data2 =
    [
        {
            name: 'Jill',
            score: 40
        },
        {
            name: 'jane',
            score: 20
        },
        {
            name: 'Jack',
            score: 50
        },
    ];

// bisect array
let data4 = d3.pairs([1, 1, 2, 3, 5], (a, b) => b - a) 
console.log(data4)
