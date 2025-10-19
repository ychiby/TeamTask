$ip = '20.205.243.166'
$hosts = 'C:\Windows\System32\drivers\etc\hosts'
$line = "$ip`tgithub.com"
Write-Output "Appending to $hosts: $line"
Add-Content -Path $hosts -Value $line
ipconfig /flushdns
Write-Output 'Done. Please remove this line from hosts after pushing to GitHub.'
