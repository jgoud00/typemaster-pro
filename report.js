const fs = require('fs');

const data = JSON.parse(fs.readFileSync('issues.json', 'utf-8'));

let html = `
<html>
<head>
<title>Sonar Report</title>
<style>
body { font-family: Arial; }
.critical { color: red; }
.high { color: orange; }
.medium { color: blue; }
.low { color: gray; }
</style>
</head>
<body>
<h1>SonarCloud Report</h1>
<ul>
`;

data.issues.forEach(issue => {
  html += `
    <li class="${issue.severity.toLowerCase()}">
      <b>${issue.severity}</b> - ${issue.message} <br/>
      File: ${issue.component} (Line ${issue.line || 'N/A'})
    </li>
  `;
});

html += `</ul></body></html>`;

fs.writeFileSync('report.html', html);
console.log("Report generated: report.html");
