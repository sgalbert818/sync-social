import React from "react";
import { AuthContext } from "../AuthContext"
import { AppContext } from "../AppContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function User() {

    const { auth, setAuth } = React.useContext(AuthContext);
    const { refDate, setRefDate } = React.useContext(AppContext);

    function logout() {
        localStorage.removeItem('user');
        setAuth(null)
    }

    function prevMonth() {
        let month = refDate.getMonth() - 1; // Subtract 1 from current month
        let year = refDate.getFullYear();
        if (month < 0) {
            month += 12; // Adjust month
            year -= 1; // Subtract a year
        }
        setRefDate(new Date(year, month, 1)); // set view
    }

    function nextMonth() {
        let month = refDate.getMonth() + 1; // Add 1 to current month
        let year = refDate.getFullYear();
        if (month > 12) {
            month -= 12; // Adjust month
            year += 1; // Add a year
        }
        setRefDate(new Date(year, month, 1)); // set view
    }

    return (
        <>
            {auth && <div className="user-logout">
                <p>Welcome, <span style={{ fontWeight: 700 }}>{auth.username}</span></p>
                <div className="prev-next-btns">
                    <button onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} className="fa"/></button>
                    <div className="calendar-header">
                        <div>
                            <h1>
                                <span style={{ fontWeight: 700 }}>{refDate.toLocaleString('default', { month: 'long' })}</span> {refDate.getFullYear()}
                            </h1>
                        </div>
                    </div>
                    <button onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight} className="fa" /></button>
                </div>
                <div>
                    <button onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} className="fa"/></button>
                </div>
            </div>}
        </>
    )
}