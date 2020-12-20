const colors = {
    reset:      '\x1b[0m',  // white
    fail:       '\x1b[31m', // red
    success:    '\x1b[32m', // green
    followers:  '\x1b[33m', // yellow
    system:     '\x1b[35m', // magenta
    screenName: '\x1b[36m', // cian
    control:    '\x1b[90m'  // gray
}

const timeStamp = (color) => {
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });

    if(color) {
        return `${colors[color]}[${time}]${colors['reset']}`;
    } else {
        return `[${time}]`;
    }
}

console.log(`${timeStamp()} teste123`);
console.log(`${timeStamp('fail')} teste456`);
console.log(`${timeStamp('success')} teste789`);
console.log(`${timeStamp('system')} asdadsada`);