let data1 = [75, 50, 100, 25, 150];
let data2 = [
    {
        name: 'Jill',
        score: 40
    },
    
    {
        name: 'Jane',
        score: 20
    },
    {
        name: 'Jack',
        score: 50
    },
    
];

let y = d3.min(data2, d=> d.score)
console.log(y)