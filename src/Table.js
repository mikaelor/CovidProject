import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import styles from "./Table.module.css";
import {
    InputField,
    Chip,
    MenuSectionHeader,
    Table,
    TableHead,
    TableRow,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableCell,
} from "@dhis2/ui";
import RelationsTable from './Relations.js'
import dateFilter from './FilterByDate.js'
import PageHandler from './Pager.js'

const TableHandler = (props, date, refresh, refreshFunc) => {
        const [showRelationsClicked, setShowRelationsClicked] = useState(false);
        const [showRelationsProps, setShowRelationsProps] = useState()
        const [showRelationsID, setShowRelationsID] = useState()

        const [showIndex, setShowIndex] = useState(true)
        const [showFollowUp, setShowFollowUp] = useState(true)
        const [filtered, setFiltered] = useState()
        const [peopleToShow, setPeopleToShow] = useState(5)
        const [pagetoShow, setPageToShow] = useState(1)
        const [filtering, setFiltering] = useState(false)

        function pagetoShowEnd(){
            return(
                pagetoShow * peopleToShow
            )
        }

        function pageToShowStart(){
            return(pagetoShowEnd() - peopleToShow)
        }

        function showAll(){
            setShowIndex(true)
            setShowFollowUp(true)
            setShowRelationsClicked(false)
        }
        
        function showIndexCases(){
            setShowIndex(true)
            setShowFollowUp(false)
            setShowRelationsClicked(false)
        }
        function showFollowUpCases(){
            setShowIndex(false)
            setShowFollowUp(true)
            setShowRelationsClicked(false)
        }
        
        function showRelations(relationsProps, id){
            setShowRelationsClicked(true)
            setShowRelationsProps(relationsProps)
            setShowRelationsID(id)
        }
        function hideRelations(){
            setShowRelationsClicked(false)
        }

        useEffect(()=>{
            if(props.refresh){
                showAll()
                props.refreshFunc(false)
            }
        }, [props.refresh])

        let filteredProps = dateFilter(props, props.date)
        let showAllChecked = showIndex && showFollowUp

        let indexer = 0;
        let pages = 0;
        let lastPage = filteredProps.length%peopleToShow

        if((Math.round(filteredProps.length/peopleToShow)<(filteredProps.length/peopleToShow))){
            pages = (Math.round(filteredProps.length/peopleToShow)+1)
            console.log(pages);
        }else{
            pages = Math.round(filteredProps.length/peopleToShow)
            console.log(pages);
        }

        const mapPeople = 
        filteredProps.map(person=>{
            let relationShips = person.relationships.length > 0
                if(!showIndex){
                    if(person.program == "Index Case"){
                        return(null)
                    }
                }
                if(!showFollowUp){
                    if(person.program == "Follow-up Case"){
                        return(null)
                    }
                }
                if(filtered){
                    let name = filtered.toLowerCase();
                    if(!(person.first_name + " " + person.surname).toLowerCase().includes(name)){
                        return null
                    }
                }
                
                let dueDate = new Date(new Date(person.dueDate).toDateString())
                let today = new Date(props.date.toDateString())
                let dayDifference = dateDifference(dueDate, today)
                let overDue = today.toDateString() != dueDate.toDateString()
                let redOverDue = dayDifference > 1
                dueDate = dueDate.toDateString()
                return([
                    <TableRow>
                    <TableCell>{person.first_name + " " + person.surname}</TableCell>
                    <TableCell>{person.phone_local}</TableCell>
                    
                    <TableCell>{person.program}</TableCell>
                    <TableCell>
                      {overDue ? (
                        redOverDue ? (
                          <div className={styles.redOverDue}>
                            {dueDate}
                            <svg 
                              className={styles.redOverDueSVG}
                              xmlns="http://www.w3.org/2000/svg" 
                              height="18" 
                              viewBox="0 0 24 24" 
                              width="18">
                                  <path d="M0 0h24v24H0V0z" 
                                  fill="none"/>
                                  <path 
                                    d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            </svg>
                          </div>
                        ) : (
                          <div className={styles.orangeOverDue}>{dueDate}</div>
                        )
                      ) : (
                        <div className={styles.normalDue}>{dueDate}</div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                        {relationShips ? (<button className={
                            (showRelationsID === person.id &&
                              styles.activeRelationsButton) +
                            " " +
                            styles.relationsButton
                          }
                        onClick={()=>showRelations(props, person.id)}>
                            Show Contacts
                        </button>):<p>No contacts</p>}
                        
                    </TableCell>
                    <TableCell>
                        <a href={person.url} target="_blank"> 
                            <button className={styles.trackerCaptureButton}>
                                Tracker Capture
                            </button>
                        </a>
                    </TableCell>
                    </TableRow>
                ])})

        let people = mapPeople;
        return(
        <div className={styles.entireTable}>
                <div className={styles.tableHeader}>
                    <h4>{props.date.toDateString()}</h4>
                    <Chip
                        className ={styles.allCasesChip}
                        onClick={showAll} selected = {showAllChecked} >
                        All cases
                        </Chip>
                        
                    <Chip
                        className ={styles.indexCasesChip}
                        onClick={showIndexCases} selected = {showIndex} >
                        Index cases
                    </Chip>
                    <Chip
                        className ={styles.followUpChip}
                        onClick={showFollowUpCases} selected= {showFollowUp}>
                        Follow-up cases
                    </Chip>
                    <InputField
                        className={styles.searchField}
                        inputWidth="220px"
                        onChange={event => setFiltered(event.value)}
                        type="text" placeholder="Search By Name" id="searchInput" value={filtered} 
                    />
                    <div className={styles.spacePagination}>
                    <PageHandler
                        className={styles.pageHandler}
                        cases={filteredProps.length}
                        display = {[2,5,10]}
                        size = {setPeopleToShow}
                        pageIncrement = {setPageToShow}
                        pageCount= {pages}
                    />
                    </div>
                </div>
        
        <div className={styles.tableOverview}>    
            <div className={styles.table}>
                
          <Table className={styles.tableHover}>
            <TableHead>
              <TableRowHead className={styles.tableRowHead}>
                <TableCellHead>{i18n.t("Full name")}</TableCellHead>
                <TableCellHead>{i18n.t("Phone")}</TableCellHead>
                <TableCellHead>{i18n.t("Program")}</TableCellHead>
                <TableCellHead>{i18n.t("Due date")}</TableCellHead>
                <TableCellHead>{i18n.t("Relationships")}</TableCellHead>
                <TableCellHead>{i18n.t("Tracker capture")}</TableCellHead>
              </TableRowHead>
            </TableHead>

            <TableBody>
              {
                   !filtered && people.slice(pageToShowStart(),pagetoShowEnd())
                }
                {
                   filtered && mapPeople
                }
            </TableBody>
          </Table>
        </div>
        <div className={styles.relations}>
          {showRelationsClicked && (
            <RelationsTable
              props={showRelationsProps}
              id={showRelationsID}
              hideRelations={hideRelations}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TableHandler;

function dateDifference(firstDate, secondDate) {
  return parseInt(
    (secondDate.getTime() - firstDate.getTime()) / (24 * 3600 * 1000)
  );
}
