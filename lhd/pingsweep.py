import subprocess

def scanner(ip):
    network = ip.replace("0/24", "")
    ips_responding = []

    for host in range(1, 254):
        ip = network + str(host)
        run_ping = subprocess.run('ping -c 1 -w 1 '+ ip,stdout=subprocess.PIPE, shell=True)
        if run_ping.returncode == 0:
            ips_responding.append(ip)
    print("Scan completed successfully!")
    print("Hosts detected: {}".format(len(ips_responding)))
    print("The following hosts responded: {}".format(" ".join(ips_responding)))

if __name__ == '__main__':
	try:
		ip = input("Please enter a /24 IP range: ")
		scanner(ip)
	except KeyboardInterrupt:
		print("Exited")