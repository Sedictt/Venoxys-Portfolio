$content = Get-Content 'c:\Users\JV\Documents\GitHub\Venoxys-Portfolio\index.html' -Raw
$content = $content -replace '(?s)  <script type="importmap">.*?</script>', '  <script type="module" src="/index.tsx"></script>'
Set-Content 'c:\Users\JV\Documents\GitHub\Venoxys-Portfolio\index.html' -Value $content -NoNewline
