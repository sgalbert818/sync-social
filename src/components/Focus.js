import React from "react"
import { AppContext } from "../AppContext"
import { formatDate } from "../helperFunctions"
import { AuthContext } from "../AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const times = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export default function Focus() {

    const { focus, setEvents, setFocus, refDate, users, setUsers } = React.useContext(AppContext);
    const { auth } = React.useContext(AuthContext);

    React.useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('https://sync-social-f87ce6f5ca84.herokuapp.com/api/user');
            const data = await response.json();
            if (response.ok) {
                const usersArray = [];
                data.forEach((user) => {
                    usersArray.push(user.username)
                })
                setUsers(usersArray)
            }
        }
        fetchUsers()
    }, [setUsers])

    const [formData, setFormData] = React.useState({
        title: '',
        date: formatDate(refDate),
        startTime: 0,
        endTime: 0,
        allDay: false,
        owner: auth.username,
    })
    const [formError, setFormError] = React.useState(null);
    const [editError, setEditError] = React.useState(null);
    const [editData, setEditData] = React.useState(null)

    React.useEffect(() => {
        setFormData((prev) => {
            return {
                ...prev,
                date: formatDate(refDate)
            }
        })
    }, [refDate])

    function updateFormData(e) {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
            }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if ((Number(formData.startTime) >= Number(formData.endTime)) && (!formData.allDay)) {
            setFormError('Error: End time must be after start time')
        } else {
            const event = {
                title: formData.title,
                day: Number(formData.date.substring(8, 10)),
                month: Number(formData.date.substring(5, 7) - 1),
                year: Number(formData.date.substring(0, 4)),
                startTime: formData.allDay ? 0 : Number(formData.startTime),
                endTime: formData.allDay ? 23 : Number(formData.endTime),
                allDay: formData.allDay,
                owner: formData.owner
            }
            const response = await fetch('https://sync-social-f87ce6f5ca84.herokuapp.com/api/events/', {
                method: 'POST',
                body: JSON.stringify(event),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            if (!response.ok) {
                setFormError('Error: Ensure all fields are filled out')
            }
            if (response.ok) {
                setFormError(null);
                setFormData({
                    title: '',
                    date: formatDate(refDate),
                    startTime: 0,
                    endTime: 0,
                    allDay: false,
                    owner: auth.username,
                })
                setEvents((prev) => {
                    return [...prev, data]
                })
            }
        }
    }

    async function handleDelete() {
        const response = await fetch(`https://sync-social-f87ce6f5ca84.herokuapp.com/api/events/${focus._id}`, {
            method: 'DELETE',
        });
        //const data = await response.json();
        if (response.ok) {
            setEvents((prev) => {
                return prev.filter(each => each._id !== focus._id)
            })
            setFocus(null)
        }
    }

    function handleEdit() {
        setFocus((prev) => {
            return {
                ...prev,
                isEditing: true
            }
        })
        setEditData({
            title: focus.title,
            date: `${focus.year}-${focus.month < 9 ? '0' + (focus.month + 1) : (focus.month + 1)}-${focus.day < 10 ? '0' + focus.day : focus.day}`,
            startTime: focus.startTime,
            endTime: focus.endTime,
            allDay: focus.allDay,
            owner: focus.owner,
        })
    }

    function updateEditData(e) {
        setEditData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
            }
        })
    }

    async function saveChanges(e) {
        e.preventDefault();
        if (editData.startTime >= editData.endTime && !editData.allDay) {
            setEditError('Error: End time must be after start time')
        } else {
            const event = {
                title: editData.title,
                day: Number(editData.date.substring(8, 10)),
                month: Number(editData.date.substring(5, 7) - 1),
                year: Number(editData.date.substring(0, 4)),
                startTime: Number(editData.startTime),
                endTime: Number(editData.endTime),
                allDay: editData.allDay,
                owner: editData.owner
            }
            const response = await fetch(`https://sync-social-f87ce6f5ca84.herokuapp.com/api/events/${focus._id}`, {
                method: 'PATCH',
                body: JSON.stringify(event),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            //const data = await response.json();
            if (!response.ok) {
                setEditError('Error: Ensure all fields are filled out')
            }
            if (response.ok) {
                setEditError(null);
                setFocus((prev) => {
                    return {
                        ...prev,
                        ...event,
                        isEditing: false
                    }
                })
                setEvents((prev) => {
                    return prev.map((each) => {
                        if (each._id === focus._id) {
                            return {
                                ...each,
                                ...event
                            }
                        } else {
                            return each
                        }
                    })
                })
            }
        }
    }

    function discardChanges(e) {
        e.preventDefault();
        setFocus((prev) => {
            return {
                ...prev,
                isEditing: false
            }
        })
    }

    return (
        <div className="split split-foc">
            <div className="add-event">
                <form onSubmit={handleSubmit}>
                    <h3>Add Event:</h3>
                    {users && auth && <div className="cal-input">
                        <div className="select-wrapper">
                            <select id="owner-input"
                                value={formData.owner}
                                name='owner'
                                onChange={updateFormData}>
                                {users.map((user) => {
                                    return <option
                                        value={user}
                                        key={user}
                                        disabled={auth.username === user ? false : true}
                                    >{user}</option>
                                })}
                            </select>
                            <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                        </div>
                    </div>}
                    <div className="cal-input">
                        <input type="text"
                            placeholder="Title"
                            onChange={updateFormData}
                            name='title'
                            value={formData.title}
                            id="title-input">
                        </input>
                    </div>

                    <div className="cal-input">
                        <input type="date"
                            onChange={updateFormData}
                            name='date'
                            value={formData.date}
                            id="date-input">
                        </input>
                    </div>

                    <div className="time-input">
                        <div className="cal-input">
                            <label htmlFor="startTime-input">Start</label>
                            <div className="select-wrapper">
                                <select id="startTime-input"
                                    value={formData.startTime}
                                    name='startTime'
                                    disabled={formData.allDay}
                                    onChange={updateFormData}>
                                    {times.map((time, index) => {
                                        return <option key={index} value={index}>
                                            {time} {index < 12 ? 'AM' : 'PM'}
                                        </option>
                                    })}
                                </select>
                                <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                            </div>
                        </div>

                        <div className="cal-input">
                            <label htmlFor="endTime-input">End</label>
                            <div className="select-wrapper">
                                <select id="endTime-input"
                                    value={formData.endTime}
                                    name='endTime'
                                    disabled={formData.allDay}
                                    onChange={updateFormData}>
                                    {times.map((time, index) => {
                                        return <option key={index} value={index}>
                                            {time} {index < 12 ? 'AM' : 'PM'}
                                        </option>
                                    })}
                                </select>
                                <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                            </div>
                        </div>

                        <div className="cal-input">
                            <label htmlFor="allDay-input">All Day</label>
                            <input type="checkbox"
                                id="allDay-input"
                                checked={formData.allDay}
                                onChange={updateFormData}
                                name='allDay'
                            ></input>
                        </div>
                    </div>

                    <div className="cal-input">
                        <button className="fa-button"><FontAwesomeIcon icon={faPlus} className="fa" /></button>
                    </div>
                </form>
                {formError && <div className="error">{formError}</div>}
            </div>

            {focus && <div className="focus-box mt15">
                {focus && !focus.isEditing && auth && <div>
                    <h3>{focus.title} - {focus.owner}</h3>
                    <p>{months[focus.month]} {focus.day}, {focus.year}</p>
                    {!focus.allDay && <p>{focus.startTime === 0 ? 12 : focus.startTime > 12 ? focus.startTime - 12 : focus.startTime}
                        {focus.startTime > 11 ? 'PM' : 'AM'}
                        - {focus.endTime > 12 ? focus.endTime - 12 : focus.endTime}
                        {focus.endTime > 11 ? 'PM' : 'AM'}</p>}
                    {((focus.allDay) || (focus.startTime === 0 && focus.endTime === 23)) &&
                        <p>All Day</p>}
                    <div className="cal-input">
                        <button className="fa-button" onClick={() => handleEdit()}
                            disabled={focus.owner.toLowerCase() === auth.username.toLowerCase() ? false : true}>
                            <FontAwesomeIcon icon={faPenToSquare} className="fa" /></button>
                        <button className="fa-button" onClick={() => handleDelete(focus._id)}
                            disabled={focus.owner.toLowerCase() === auth.username.toLowerCase() ? false : true}>
                            <FontAwesomeIcon icon={faTrash} className="fa" /></button>
                    </div>
                </div>}

                {focus && focus.isEditing && <div>
                    <form>
                        <h3>Edit Event:</h3>
                        {users && auth && <div className="cal-input">
                            <div className="select-wrapper">
                                <select id="owner-edit"
                                    value={editData.owner}
                                    name='owner'
                                    onChange={updateEditData}>
                                    {users.map((user) => {
                                        return <option value={user}
                                            key={user}
                                            disabled={auth.username === user ? false : true}
                                        >{user}</option>
                                    })}
                                </select>
                                <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                            </div>
                        </div>}
                        <div className="cal-input">
                            <input type="text"
                                onChange={updateEditData}
                                name='title'
                                value={editData.title}
                                id="title-edit">
                            </input>
                        </div>

                        <div className="cal-input">
                            <input type="date"
                                onChange={updateEditData}
                                name='date'
                                value={editData.date}
                                id="date-edit">
                            </input>
                        </div>

                        <div className="time-input">
                            <div className="cal-input">
                                <label htmlFor="startTime-edit">Start</label>
                                <div className="select-wrapper">
                                    <select id="startTime-edit"
                                        value={editData.startTime}
                                        name='startTime'
                                        disabled={editData.allDay}
                                        onChange={updateEditData}>
                                        {times.map((time, index) => {
                                            return <option key={index} value={index}>
                                                {time} {index < 12 ? 'AM' : 'PM'}
                                            </option>
                                        })}
                                    </select>
                                    <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                                </div>
                            </div>

                            <div className="cal-input">
                                <label htmlFor="endTime-edit">End</label>
                                <div className="select-wrapper">
                                    <select id="endTime-edit"
                                        value={editData.endTime}
                                        name='endTime'
                                        disabled={editData.allDay}
                                        onChange={updateEditData}>
                                        {times.map((time, index) => {
                                            return <option key={index} value={index}>
                                                {time} {index < 12 ? 'AM' : 'PM'}
                                            </option>
                                        })}
                                    </select>
                                    <FontAwesomeIcon icon={faAngleDown} className="fa fa-dropdown" />
                                </div>
                            </div>

                            <div className="cal-input">
                                <label htmlFor="allDay-edit">All Day</label>
                                <input type="checkbox"
                                    id="allDay-edit"
                                    name="allDay"
                                    checked={editData.allDay}
                                    onChange={updateEditData}
                                ></input>
                            </div>
                        </div>
                        <div className="cal-input">
                            <button className="fa-button" onClick={saveChanges}><FontAwesomeIcon icon={faFloppyDisk} className="fa" /></button>
                            <button className="fa-button" onClick={discardChanges}><FontAwesomeIcon icon={faBan} className="fa" /></button>
                        </div>
                    </form>
                    {editError && <div className="error">{editError}</div>}
                </div>}
            </div>}

            {users && <div className="my-group mt15">
                <h3>My Group:</h3>
                <div className="grouplings">
                    {users.map((user) => {
                        return <div key={user} className={`user-disp ${user}`}>
                            <h5>{user}</h5>
                        </div>
                    })}
                </div>
            </div>}
        </div>
    )
}