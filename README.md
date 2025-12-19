
Ein simples Skript, das über einen GET-Request einen Stundenplan von WebUntis erstellt im .ics Format erstellt.

## Vor dem Verwenden

Sie müssen express installieren, damit sich das Programm ausführen lässt

```http
npm install express
```

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

Sie benötigen folgende Daten, um das Skript nutzen zu können:

- `server`: Komplette URL des Untis Servers (inkl. webuntis.com)
- `school`: Kurzname Ihrer Schule
- `username`: Ihr WebUntis Nutzername
- `password`: Ihr WebUntis Passwort


Hier ist ein Beispiel:

```http
http://<your-server-adress>:3979?server=<server>.webuntis.com&school=<school>&username=<username>&password=<password>
```
