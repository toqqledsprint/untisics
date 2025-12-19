##

Ein simples Skript, das über einen GET-Request einen Stundenplan von WebUntis erstellt im .ics Format erstellt.


## Verwendung

Um dieses Skript nutzen zu können, benötigen Sie die URL ihres WebUntis Servers.

```http
https://<server>.webuntis.com/
```

Beispiel:
```http
https://bbs-tghs.webuntis.com/
```

Um den Kurznamen Ihrer Bildungseinrichtung zu erhalten, klicken Sie auf der WebUntis Startseite auf den RSS-Feed. Der Link sollte nun wie folgt aussehen:
    
```http
https://<server>.webuntis.com/WebUntis/NewsFeed.do?school=<school>
```

Beispiel:
```http
https://bbs-tghs.webuntis.com/WebUntis/NewsFeed.do?school=bbs-tghs
```

To generate an ICS file, you need to make a GET request to the ICSUntis server with the following parameters:

- `server`: komplette URL des Untis Servers (inkl. webuntis.com)
- `school`: Kurzname Ihrer Schule
- `username`: Ihr WebUntis Nutzername
- `password`: Ihr WebUntis Passwort


Hier ist ein Beispiel:

```http
http://<your-server-adress>:3979?server=<server>.webuntis.com&school=<school>&username=<username>&password=<password>
```
