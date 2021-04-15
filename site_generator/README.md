# Site Generator

## Local setup:

* Add the following to /etc/hosts:
```c
127.0.0.1	site1.adsa-project.local
127.0.0.1	site2.adsa-project.local
127.0.0.1	site3.adsa-project.local
```
* Add the following vhost configurations to apache:
```apache
<VirtualHost 127.0.0.1:80>
	ServerName	        site1.adsa-project.local
	ProxyPass           /	http://localhost:5000/
	ProxyPassReverse	/	http://localhost:5000/
</VirtualHost>
```
```apache
<VirtualHost 127.0.0.1:80>
	ServerName	        site2.adsa-project.local
	ProxyPass           /	http://localhost:5000/
	ProxyPassReverse	/	http://localhost:5000/
</VirtualHost>
```
```apache
<VirtualHost 127.0.0.1:80>
	ServerName          site3.adsa-project.local
	ProxyPass		    /	http://localhost:5000/
	ProxyPassReverse	/	http://localhost:5000/
</VirtualHost>
```
* Generate the sites by running all cells of the generator notebook
* `cd site/`
* `npm install`
* `npm start`