# Gobuster

cd Documents 1/gobuster

gobuster dns --domain straumann.com -w subdomains-top1million-5000.txt -t 40 -q

gobuster dir --u https://matchscan.straumann.com/* -w subdomains-top1million-5000.txt --exclude-length 541 -t 40 -q
