import React from "react";
import i18n from "@dhis2/d2-i18n";
import styles from "./Table.module.css";
import {
  Button,
  MenuSectionHeader,
  Table,
  TableHead,
  TableRow,
  TableRowHead,
  TableCellHead,
  TableBody,
  TableCell,
} from "@dhis2/ui";

const RelationsTable = (props, id, hideRelations) => {
  let mainPerson = [];
  props.props.props.map((person) => {
    if (person.id == props.id) {
      mainPerson = person;
    }
  });
  let relationsData = [];

    mainPerson.relationships.map(relationid => {
        props.props.props.map(person =>{
            if(person.id == relationid){
                relationsData.push(person)
            }
        })
    })
    return(
        <div className={styles.stickyRelations}>
                <Table>
                <TableHead>
                    <TableRowHead className={styles.tableRowHead}>
                    <TableCellHead>{i18n.t("Full name")}</TableCellHead>
                    <TableCellHead>{i18n.t("Phone")}</TableCellHead>
                
                    <TableCellHead>{i18n.t("Program")}</TableCellHead>
                    <TableCellHead>{i18n.t("Contacted")}</TableCellHead>
                    <TableCellHead><Button 
                className={styles.closeIcon}
                icon ={
                    <svg 
                        height="24" 
                        viewBox="0 0 24 24" 
                        width="24" 
                        xmlns="http://www.w3.org/2000/svg"
                        > 
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        }
                destructive
                onClick={()=> props.hideRelations()}
                small>
            </Button></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>

                {
                relationsData.map(person =>{
                let contacted = false
                if(person.dueDate == ""){
                contacted = true
                }
                return(
            
                <TableRow>
                    <TableCell>{person.first_name + " " + person.surname}</TableCell>
                    <TableCell>{person.phone_local}</TableCell>
                    <TableCell>{person.program}</TableCell>
                    <TableCell>{(contacted ? "Yes" : "No")}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                )
                }
                )
                }
                </TableBody>
                </Table>
            </div> 
    )
}

export default RelationsTable;
