
export default function dateFilter(props, date){
    //Could include a boolean parameter specifying if overdue is wanted.
    let includeOverDue = false
    date = createDateFormat(date)
    let today = createDateFormat(new Date())

    if(date == today){
        includeOverDue = true
    }
        
    let filteredProps = props.props.filter(person=>{
        let personDueDate = person.dueDate
        
        if(personDueDate == ""){
            return false
        }

        if(date > personDueDate & includeOverDue){
            return true
        }
        else if(date == personDueDate){
            return true
        }
        else{
            return false
        }
    })
    return filteredProps
}

function createDateFormat(date){
    let getDate = date.getDate()
    if(getDate < 10){
        getDate = "0" + getDate
    }
    date = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + getDate
    return date
}