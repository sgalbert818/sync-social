import React from 'react';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [refDate, setRefDate] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [calendar, setCalendar] = React.useState(Array.from({ length: 42 }, (_, i) => ({ boxindex: i }))) // initialize calendar setup
  const [events, setEvents] = React.useState(null)
  const [focus, setFocus] = React.useState(null)
  const [today, setToday] = React.useState(null)
  const [users, setUsers] = React.useState(null)

  return (
    <AppContext.Provider value={{
      refDate, setRefDate,
      calendar, setCalendar,
      events, setEvents,
      focus, setFocus,
      today, setToday,
      users, setUsers
    }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext }