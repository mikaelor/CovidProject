import React from "react";
import dateFilter from "./FilterByDate";
import { MenuSectionHeader, Button } from "@dhis2/ui";
import classes from "./Schedule.module.css";

const Weekly = (props, switchToContacts, switchWeek, startDate) => {
  const numDaysView = 7;
  const numWeeks = 3;
  const numDaysTotal = numDaysView * numWeeks;
  let days = [];
  let totalCases = 0;
  let today = new Date(new Date().toDateString());
  let todayStartWeek = getMonday(today);
  let startDateFormatted = new Date(props.startDate.toDateString());
  let startWeek = getMonday(startDateFormatted);
  let weekNumber = getWeekNumber(startWeek);

  let nextDate = new Date();
  let previousDate = new Date();

  let nextWeek = true;
  let lastWeek = false;
  let dateDiff = dateDifference(todayStartWeek, startWeek);

  if (dateDiff + numDaysView >= numDaysTotal) {
    nextWeek = false;
  }
  if (dateDiff >= numDaysView) {
    lastWeek = true;
  }
  if (lastWeek) {
    previousDate.setDate(startDateFormatted.getDate() - numDaysView);
  }
  if (nextWeek) {
    nextDate.setDate(startDateFormatted.getDate() + numDaysView);
  }
  for (let i = 0; i < numDaysView; i++) {
    let date = new Date(startWeek);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return (
    <div className={classes.scheduleContainer}>
      <h4 className={classes.scheduleTitle}>{"Week " + weekNumber}</h4>

      <div className={classes.schedule}>
        {days.map((day) => {
          let diff = dateDifference(today, day);
          let disabled = false;
          let todayBool = false;
          let numCases = 0,
            numIndex = 0,
            numFollowUp = 0;
          if (diff < 0) {
            disabled = true;
          } else {
            todayBool = diff == 0;
            let casesOnDay = dateFilter(props, day);
            let counts = countCases(casesOnDay);
            numCases = counts.numCases;
            numIndex = counts.numIndex;
            numFollowUp = counts.numFollowUp;
            totalCases += numCases;
          }

          return (
            <div key={day.toDateString()} className={classes.week}>
              <div
                className={
                  todayBool
                    ? classes.weekDayToday + " " + classes.weekDay
                    : classes.weekDay
                }
              >
                {" "}
                {day.toDateString()}{" "}
              </div>
              <div
                className={
                  disabled
                    ? classes.disabledScheduleBox
                    : numCases == 0
                    ? classes.noCasesBox + " " + classes.scheduleBox
                    : classes.scheduleBox
                }
              >
                <div
                  className={disabled ? classes.disabledTotal : classes.total}
                  onClick={disabled ? null : () => props.switchToContacts(day)}
                >
                  <div className={classes.totalText}> Number of cases: </div>
                  <div className={classes.totalNum}> {numCases} </div>
                </div>
                <div className={classes.index}>
                  <div className={classes.indexText}> Index cases: </div>
                  <div className={classes.indexNum}> {numIndex} </div>
                </div>
                <div className={classes.followUp}>
                  <div className={classes.followUpText}> Follow-up cases: </div>
                  <div className={classes.followUpNum}> {numFollowUp} </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={classes.scheduleButtons}>
        {lastWeek ? (
          <Button
            className={classes.previousWeekButton}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            }
            onClick={() => props.switchWeek(previousDate)}
          ></Button>
        ) : (
          <Button
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            }
            className={
              classes.previousWeekButton + " " + classes.disabledWeekButton
            }
            disabled
          ></Button>
        )}

        <div className={classes.totalCasesDiv}>
          Total cases this week: {totalCases}
        </div>

        {nextWeek ? (
          <Button
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            }
            className={classes.nextWeekButton}
            onClick={() => props.switchWeek(nextDate)}
          ></Button>
        ) : (
          <Button
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            }
            className={
              classes.nextWeekButton + " " + classes.disabledWeekButton
            }
            disabled
          ></Button>
        )}
      </div>
    </div>
  );
};
export default Weekly;

function countCases(casesList) {
  let numIndex = 0;
  let numFollowUp = 0;
  let numCases = casesList.length;
  for (let i = 0; i < numCases; i++) {
    if (casesList[i].program == "Index Case") {
      numIndex++;
    } else if (casesList[i].program == "Follow-up Case") {
      numFollowUp++;
    }
  }
  return { numCases, numIndex, numFollowUp };
}

function dateDifference(firstDate, secondDate) {
  return parseInt(
    (secondDate.getTime() - firstDate.getTime()) / (24 * 3600 * 1000)
  );
}

function getMonday(d) {
  let date = new Date(d);
  let day = date.getDay();
  let diff = date.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

//Function for getting weeknumber copied from:
//https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}
