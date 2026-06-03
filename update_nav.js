import fs from 'fs';

let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace('من نحن وماذا نقدم', 'من نحن');
navbar = navbar.replace('اتصل بنا', 'مركز التواصل والدعم');
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
footer = footer.replace('من نحن وماذا نقدم', 'من نحن');
footer = footer.replace('اتصل بنا', 'مركز التواصل والدعم');
fs.writeFileSync('src/components/layout/Footer.tsx', footer);

