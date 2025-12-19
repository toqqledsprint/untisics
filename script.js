import express from 'express';
import { createEvents } from 'ics';
import { WebUntis } from 'webuntis';

const app = express();
const port = 3979;

app.get('/', async (req, res) => {
    try {
        const { server, school, username, password } = req.query;

        if (!server & !school & !username & !password) {
            return res.redirect('https://simon.eftekhari.xyz');
        }

        if (!server || !school || !username || !password) {
            return res.status(400).send('Sie müssen Server, Schule, Benutzer und Passwort angeben!');
        }

        const untis = new WebUntis(school, username, password, server);
        await untis.login();

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 2);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 2);

        const timetable = await untis.getOwnTimetableForRange(startDate, endDate);

        const events = timetable
            .filter(lesson => lesson.code !== 'cancelled')
            .map(lesson => {
                const dateStr = lesson.date.toString();
                const year = parseInt(dateStr.slice(0, 4));
                const month = parseInt(dateStr.slice(4, 6));
                const day = parseInt(dateStr.slice(6, 8));

                const startHour = Math.floor(lesson.startTime / 100);
                const startMinute = lesson.startTime % 100;
                const endHour = Math.floor(lesson.endTime / 100);
                const endMinute = lesson.endTime % 100;

                const subjects = lesson.su.map(subject => subject.name).join(', ');
                const fullsubjects = lesson.su.map(subject => subject.longname).join(', ');
                const rooms = lesson.ro ? lesson.ro.map(room => room.name).join(', ') : 'Kein Raum';
                const teachers = lesson.te ? lesson.te.map(teacher => teacher.longname).join(', ') : 'Kein Lehrer';

                const inf = lesson.info ? `\nInfo: ${lesson.info}` : '';

                // Hausaufgaben und Lehrstoff hinzufügen
                const fullinfo = `Fach: ${fullsubjects}\nLehrer: ${teachers}${inf}\Hausaufgaben: ${lesson.hw || 'Keine Hausaufgaben'}\nLehrstoff: ${lesson.ld || 'Kein Lehrstoff'}`;

                return {
                    start: [year, month, day, startHour, startMinute],
                    end: [year, month, day, endHour, endMinute],
                    title: subjects || 'Stunde',
                    location: rooms,
                    description: fullinfo,
                };
            });

        // Events zusammenführen, falls aufeinanderfolgend
        const mergedEvents = [];
        for (let i = 0; i < events.length; i++) {
            const currentEvent = events[i];
            const nextEvent = events[i + 1];

            if (
                nextEvent &&
                currentEvent.title === nextEvent.title &&
                currentEvent.location === nextEvent.location &&
                currentEvent.description === nextEvent.description &&
                currentEvent.start[0] === nextEvent.start[0] && // Gleiches Jahr
                currentEvent.start[1] === nextEvent.start[1] && // Gleicher Monat
                currentEvent.start[2] === nextEvent.start[2] // Gleicher Tag
            ) {
                mergedEvents.push({
                    ...currentEvent,
                    end: nextEvent.end
                });
                i++;
            } else {
                mergedEvents.push(currentEvent);
            }
        }

        createEvents(mergedEvents, (error, value) => {
            if (error) {
                console.error(error);
                res.status(500).send('Es ist ein Fehler aufgetreten!');
                return;
            }

            res.setHeader('Content-Disposition', 'attachment; filename="timetable.ics"');
            res.setHeader('Content-Type', 'text/calendar');
            res.send(value);
        });
    } catch (error) {
        console.error('Beim erstellen des Stundenplans ist ein Fehler aufgetreten:', error);
        res.status(500).send('Beim erstellen des Stundenplans ist ein Fehler aufgetreten!');
    }
});

app.listen(port, () => {
    console.log(`UntisIcs läuft auf http://localhost:${port}`);
});
