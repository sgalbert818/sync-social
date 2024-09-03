import React from "react"
import { AppContext } from "../AppContext"

export default function CalBox({ box }) {

    const { setFocus, setEvents, users } = React.useContext(AppContext);

    const styles = {
        backgroundColor: box.isToday ? 'white' : 'rgb(235, 235, 235)',
    }

    function clickHandler(each) {
        setFocus({...each, isEditing: false})
        setEvents((prev) => {
            return prev.map((event) => {
                if (event._id === each._id) {
                    return {
                        ...event,
                        isFocused: true
                    }
                } else {
                    return {
                        ...event,
                        isFocused: false
                    }
                }
            })
        })
    }

    return (
        <div className="cal-box">
            <div className="corner-number" style={styles}>
                {box.day}
            </div>
            {users && box.events && box.events.map((each) => {
                return <div className={`event ${each.owner.toLowerCase()}`} onClick={() => clickHandler(each)}
                    key={each._id}
                    style={{backgroundColor: each.isFocused ? 'white' : '',
                        color: each.isFocused ? '' : 'white',
                    }}
                    >{each.title}</div>
            })}
        </div>
    )
}