# More Tools

PowerShell

- Verificar conexção com porta

Test-NetConnection matchscan.straumann.com -Port 5432

- Encontrar IPs de name server

nslookup matchscan.straumann.com

- Testar conexão

ping matchscan.straumann.com

- Enviar email por smtp

Send-MailMessage `

-SmtpServer smtp.straumann.com `

-Port 25 `

-From "NEODENT | MatchScan App <matchscan@neodent.com>" `

-To "gabriel.oliveira@neodent.com" `

-Subject "Teste SMTP - MatchScan" `

-Body "Email de teste enviado via SMTP corporativo." `

-Encoding UTF8
