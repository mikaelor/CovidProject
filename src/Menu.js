import React, { useState } from 'react';
import classes from './Menu.module.css';
import Weekly from './Schedule';
import TableHandler from './Table';


const MainMenu = (props) => {
    const [showContacts, setShowContacts] = useState(true);
    const [showSchedule, setShowSchedule] = useState(false);
    const [dateView, setDateView] = useState(new Date())
    const [weekDateSchedule, setWeekDaySchedule] = useState(new Date())
    const [hideContacts, setHideContacts] = useState(true)
    const [today, setToday] = useState(true)

    function switchToContacts(date){
      if(date.toDateString() == new Date().toDateString()){
        setToday(true)
      }
      else{
        setToday(false)
      }
      setShowContacts(true)
      setShowSchedule(false)
      setDateView(date)
      setWeekDaySchedule(new Date())
      setHideContacts(true)
    }

  return (
    <div className={classes.container}>
        <div className={classes.item}></div>
        <div className={classes.items}>
          <div>
              <button className={classes.todayButton + " " + (showContacts == true ? (today ? classes.activeMenuButton : "") : "")}
                onClick={() => {
                  switchToContacts(new Date())
                  }} autoFocus>
                Today
              </button>
          </div>
          <div>
              <button className={classes.weekButton + " " + (showSchedule == true ? classes.activeMenuButton: "")}
                onClick={() => {
                  setShowSchedule(true); 
                  setShowContacts(false)}}>
                Week
              </button>
          </div>
        </div>

      <div>
        {showContacts && (
          <TableHandler
            props={props.props}
            date={dateView}
            refresh={hideContacts}
            refreshFunc={setHideContacts}
          />
        )}
        {showSchedule && (
          <Weekly
            props={props.props}
            switchToContacts={switchToContacts}
            switchWeek={setWeekDaySchedule}
            startDate={weekDateSchedule}
          />
        )}
      </div>
    </div>
  );
};

export default MainMenu;
