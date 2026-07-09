const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace single quotes
    content = content.replace(/'http:\/\/localhost:8081(.*?)'/g, "`\\${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}$1`");
    // Replace template literals
    content = content.replace(/`http:\/\/localhost:8081(.*?)`/g, "`\\${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}$1`");
    fs.writeFileSync(filePath, content);
}

const files = [
    'frontend/src/pages/AdminDashboard.tsx',
    'frontend/src/pages/Login.tsx',
    'frontend/src/pages/StudentDashboard.tsx',
    'frontend/src/pages/TeacherDashboard.tsx'
];

files.forEach(f => replaceInFile(path.join(__dirname, f)));
console.log("Replaced localhost URLs with environment variables.");
