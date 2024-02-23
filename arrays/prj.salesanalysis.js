// store sales data across 4 regions, with top 4 categories of goods
const SALES_DATA = [
    {
        region: 'North',
        s_t: 325000, // sports and travel
        h_l: 550000, // home and lifestyle
        e_g: 350000, // electronics and gadgets
        h_b: 300000, // health and beauty
    },
    {
        region: 'East',
        s_t: 400000, // sports and travel
        h_l: 500000, // home and lifestyle
        e_g: 450000, // electronics and gadgets
        h_b: 350000, // health and beauty
    },
    {
        region: 'South',
        s_t: 350000, // sports and travel
        h_l: 400000, // home and lifestyle
        e_g: 500000, // electronics and gadgets
        h_b: 325000, // health and beauty
    },
    {
        region: 'West',
        s_t: 600000, // sports and travel
        h_l: 350000, // home and lifestyle
        e_g: 550000, // electronics and gadgets
        h_b: 500000, // health and beauty
    },
];

// A map for avvreviations

const ABBR = new Map(
    [
        ['s_t', 'Sports and Travel'],
        ['h_l', 'Home and Lifestyle'],
        ['e_g', 'Electronics  and Gadgets'],
        ['h_b', 'Health  and Beauty'],
    ]
)

// console.log(ABBR)

// width and height of svg elements in row1 and row2
const SVG_W_R1 = document.querySelector('#row1 svg').clientWidth;
const SVG_H_R1 = document.querySelector('#row1 svg').clientHeight;

const SVG_W_R2 = document.querySelector('#row2 svg').clientWidth;
const SVG_H_R2 = document.querySelector('#row2 svg').clientHeight;

// buffer area around the svg
const BUFFER = 25;
const DATA_LENGTH = SALES_DATA.length;

// svg references
const STAT_SVG = d3.select('#statistics svg')
const ITER_SVG = d3.select('#iterations svg')
const SEAR_SVG = d3.select('#search svg')
const TRAN_SVG = d3.select('#transformations svg')
const SETS_SVG = d3.select('#sets svg')

// linear scale helper function

function linearScale_helper(d_start, d_end, r_start, r_end) {
    const LINEAR_SCALE = d3.scaleLinear()
        .domain([d_start, d_end])
        .range([r_start, r_end])
    return LINEAR_SCALE;
}

// axis creation helper function
function axis_helper(type, ticks, scale) {
    let AXIS;
    if (type == 'left') {
        AXIS = d3.axisLeft(scale)
    }
    else if (type == 'right') {
        AXIS = d3.axisRight(scale)
    }

    else if (type == 'top') {
        AXIS = d3.axisTop(scale)
    }
    else {
        AXIS = d3.axisBottom(scale)
    }
    AXIS.ticks(ticks)
    return AXIS;
}

// axis group creation
function group_helper(context, id, x, y) {
    const GROUP = context.append('g')
        .attr('id', id)
        .attr('transform', `translate(${x}, ${y})`);
    return GROUP;
}


// category color scale
const CAT_COLOR_SCALE = d3.scaleOrdinal()
    .domain([...Object.keys(SALES_DATA[0])])
    .range(d3.schemePastel1)


// Transition
const T1 = d3.transition().duration(2500)

// statistics
function minOrMax_helper(obj, status, r_status) {

    let value, valueKey;

    for (key in obj) {

        if (Number.isInteger(obj[key])) {
            if (status == 'min') {
                value = d3.min([obj[key], value])
            }
            if (status == 'max') {
                value = d3.max([obj[key], value])
            }
        }
        valueKey = obj[key] === value ? key : valueKey;
    }
    if (r_status == 0) {
        return value;
    }
    if (r_status == 1) {
        return valueKey;
    }
    if (r_status == 2) {
        return {
            [valueKey]: value
        }
    }

}

// max value
let max_value = []

for (let i = 0; i < SALES_DATA.length; i++) {
    max_value.push(minOrMax_helper(SALES_DATA[i], 'max', 0))
}

// y axis
const STAT_Y_AXIS_SCALE = linearScale_helper(0, DATA_LENGTH - 1, BUFFER, SVG_H_R1 - BUFFER)
const STAT_Y_AXIS = axis_helper('left', 0, STAT_Y_AXIS_SCALE)
const STAT_Y_AXIS_G = group_helper(STAT_SVG, 'statYaxis', BUFFER, 0)
STAT_Y_AXIS(STAT_Y_AXIS_G);

// x axis
const STAT_X_AXIS_SCALE = linearScale_helper(0, d3.max(max_value), BUFFER, SVG_W_R1 - BUFFER)
const STAT_X_AXIS = axis_helper('bottom', 4, STAT_X_AXIS_SCALE)
const STAT_X_AXIS_G = group_helper(STAT_SVG, 'statXaxis', 0, SVG_H_R1 - BUFFER)
STAT_X_AXIS(STAT_X_AXIS_G);

// create a group for each data point
SALES_DATA.forEach((obj, index) => STAT_SVG.append('g').attr('id', `stat${index}`))

// render the bars
const MAX_HEIGHT = (SVG_H_R1 - 2 * BUFFER) / DATA_LENGTH;

SALES_DATA.forEach((obj, index) => {
    d3.select(`#stat${index}`)
        .selectAll('rect')
        .data([minOrMax_helper(SALES_DATA[index], 'min', 0), minOrMax_helper(SALES_DATA[index], 'max', 0)])
        .join('rect')
        .attr('height', MAX_HEIGHT / 2 - 2)
        .attr('x', BUFFER + 2)
        .attr('y', (d, i) => i == 0 ?
            linearScale_helper(0, DATA_LENGTH - 1, BUFFER, SVG_H_R1 - BUFFER - MAX_HEIGHT)(index) :
            linearScale_helper(0, DATA_LENGTH - 1, BUFFER, SVG_H_R1 - BUFFER - MAX_HEIGHT)(index) + MAX_HEIGHT / 2)
        .style('fill', (d, i) => i == 0 ?
            CAT_COLOR_SCALE(minOrMax_helper(SALES_DATA[index], 'min', 1)) :
            CAT_COLOR_SCALE(minOrMax_helper(SALES_DATA[index], 'max', 1)))
        .attr('rx', '3')
        .attr('ry', '3');
});

SALES_DATA.forEach((obj, index) => {
    d3.select(`#stat${index}`)
        .selectAll('rect')
        .transition(T1)
        .attr('width', d => STAT_X_AXIS_SCALE(d) - BUFFER)
});


SALES_DATA.forEach((obj, index) => {
    d3.select(`#stat${index}`)
        .selectAll('text')
        .data([SALES_DATA[index].region])
        .join('text')
        .text(d => d[0])
        .attr('x', '1')
        .attr('y', linearScale_helper(0, DATA_LENGTH - 1, BUFFER + MAX_HEIGHT / 2, SVG_H_R1 - BUFFER - MAX_HEIGHT / 2)(index))
        .style('fill', 'gray')
        .style('font-size', '11')
})

// Iterations

function meanAndMap_helper(obj) {
    let value = [], newObj = {}, i = 0;

    for (key in obj) {
        if (Number.isInteger(obj[key])) {
            value.push(obj[key]);
        }
    }

    let meanOutput = d3.map(value, d => d >= d3.mean(value));

    for (key in obj) {
        if (Number.isInteger(obj[key])) {
            if (meanOutput[i]) {
                newObj[key] = obj[key]
            }
            i++;
        }
    }

    console.log(' array ', Object.entries(newObj))

    return Object.entries(newObj);
}

// y axis
const ITER_Y_AXIS_G = group_helper(ITER_SVG, 'iterYAxis', BUFFER, 0)
STAT_Y_AXIS(ITER_Y_AXIS_G);
// x axis
const ITER_X_AXIS_G = group_helper(ITER_SVG, 'iterXAxis', 0, SVG_H_R1 - BUFFER);
STAT_X_AXIS(ITER_X_AXIS_G);

// create a group for each data point
SALES_DATA.forEach((obj, index) => ITER_SVG.append('g').attr('id', `iter${index}`));
SALES_DATA.forEach((obj, index) => {
    d3.select(`#iter${index}`)
        .selectAll('rect')
        .data(meanAndMap_helper(obj))
        .join('rect')
        .attr('height', MAX_HEIGHT / 4 - 2)
        .attr('x', BUFFER + 2)
        .attr('y', (d, i) => linearScale_helper(0, DATA_LENGTH - 1, BUFFER, SVG_H_R1 - BUFFER - MAX_HEIGHT)(index) +
            (MAX_HEIGHT / 4 - 2) * i)
        .style('fill', (d, i) => CAT_COLOR_SCALE(meanAndMap_helper(obj)[i][0]))
        .attr('rx', '3')
        .attr('ry', '3');
});

SALES_DATA.forEach((obj, index) => {
    d3.select(`#iter${index}`)
    .selectAll('rect')
    .transition(T1)
    .attr('width',d=> STAT_X_AXIS_SCALE(d[1])-BUFFER)
})

SALES_DATA.forEach((obj, index) => {
    d3.select(`#iter${index}`)
        .selectAll('text')
        .data([SALES_DATA[index].region])
        .join('text')
        .text(d => d[0])
        .attr('x', '1')
        .attr('y', linearScale_helper(0, DATA_LENGTH - 1, BUFFER + MAX_HEIGHT / 2, SVG_H_R1 - BUFFER - MAX_HEIGHT / 2)(index))
        .style('fill', 'gray')
        .style('font-size', '11')
})

// search
let entries = []
SALES_DATA.forEach((obj, index) => {
    for( key in obj) {
        if(Number in obj) {
            if(Number.isInteger(obj[key])) {
                entries.push([index, key, obj[key]])
            }
        }
    }
})

// y axis




