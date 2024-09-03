import React from "react"
import CalBox from "./CalBox"
import { findReturnMonth, findReturnYear, getDaysInMonth } from "../helperFunctions"
import { AppContext } from "../AppContext"

export default function Calendar() {

    const { refDate,
        calendar, setCalendar,
        events, setEvents,
        today, setToday } = React.useContext(AppContext);

    // constants
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const todayRef = React.useRef(new Date());

    React.useEffect(() => {
        setToday(todayRef.current)
    })

    React.useEffect(() => { // get all events in calendar events DB
        const fetchEvents = async () => {
            const response = await fetch('https://sync-social-f87ce6f5ca84.herokuapp.com/api/events');
            const data = await response.json();
            if (response.ok) {
                setEvents(data)
            }
        }
        fetchEvents()
    }, [setEvents])

    React.useEffect(() => { // updates calendar grid every time refDate (reference date) is changed
        if (events && today) { // only run once calendar events from DB have loaded and today is set
            const renderDaysArray = []; // initialize empty array to map dates
            const firstOfMonthIndex = refDate.getDay(); // first of month day of the week index (0-6)
            const daysInPrevMonth = new Date(refDate - 1).getDate(); // # of days in prev month
            const calendarStart = daysInPrevMonth - (firstOfMonthIndex - 1); // date of calendar box at index 0
            for (let i = 0; i < firstOfMonthIndex; i++) { // fill in days before current month
                renderDaysArray.push(calendarStart + i);
            }
            for (let i = 1; i <= getDaysInMonth(refDate); i++) { // add current month
                renderDaysArray.push(i)
            }
            let extraDays = 1;
            while (renderDaysArray.length < 43) { // fill in days after current month
                renderDaysArray.push(extraDays);
                extraDays++
            }
            setCalendar((prev) => { // map days array to calendar grid
                return prev.map((each) => {
                    const day = renderDaysArray[each.boxindex];
                    const month = findReturnMonth(each.boxindex, renderDaysArray, refDate);
                    const year = findReturnYear(each.boxindex, renderDaysArray, refDate);
                    const eventsForDate = events.filter(event => { // map correct events to each date
                        return event.day === day
                            && event.month === month
                            && event.year === year
                    });
                    const sortedEvents = eventsForDate.sort((a, b) => a.startTime - b.startTime);
                    return {
                        ...each,
                        day,
                        month,
                        year,
                        events: sortedEvents,
                        isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? true : false
                    }
                })
            })
        }
    }, [refDate, events, setCalendar, today])

    return (
        <div className="split split-cal">
            <div className="days-of-week">
                {daysOfWeek.map((day) => {
                    return <div key={day}><p>{day.slice(0, 3)}</p></div>
                })}
            </div>
            <div className="calendar-container">
                <div className="calendar-body">
                    {calendar && calendar.map((box) => {
                        return <CalBox key={box.boxindex} box={box}></CalBox>
                    })}
                </div>
            </div>
        </div>
    )
}