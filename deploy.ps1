Set-Location ./Client
Remove-Item ./build -Recurse -Force
npm run build

Set-Location ../Server
Remove-Item ./dist -Recurse -Force
npm run build

Set-Location ..
Remove-Item ./Deploy -Recurse -Force
New-Item -ItemType Directory -Force -Path ./Deploy
Copy-Item ./Server/dist ./Deploy/Server -Recurse -Force
Copy-Item ./Server/package.json ./Deploy/Server
Copy-Item ./Client/build ./Deploy/Client -Recurse -Force