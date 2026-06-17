const fs = require('fs');

const file = 'src/pages/AdminPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect, useMemo } from "react";');

content = content.replace(/event\.title/g, 'event.message');
content = content.replace(/event\.date/g, 'event.timestamp');

fs.writeFileSync(file, content);
console.log('done fixing timeline event fields and useMemo import');
