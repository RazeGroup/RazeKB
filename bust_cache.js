const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const ts = Date.now();
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/href="style\.css([^"]*)"/g, `href="style.css?v=${ts}"`);
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Busted cache in html files.');
