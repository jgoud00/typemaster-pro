const fs = require('fs');
const data = JSON.parse(fs.readFileSync('issues.json', 'utf-8'));
const severe = data.issues.filter(i => ['CRITICAL', 'MAJOR'].includes(i.severity));
severe.forEach(i => console.log(i.severity + ': ' + i.component + ' - ' + i.message + ' (Line ' + i.line + ')'));
