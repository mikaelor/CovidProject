import { useConfig, useDataQuery } from '@dhis2/app-runtime'

const organisationUnit = "cC2LHfmYHXQ" //Klepp Kommune
const indexCaseProgram = "uYjxkTbwRNf"
const followUpCaseProgram = "DM9n1bUw8W8"
const programStageFollowUp = "sAV9jAajr8x"
const programStageHealthStatus = "oqsk2Jv4k3s"

const query = () => {
    return {
        followUpCases: {
            resource: 'trackedEntityInstances',
            params: {
            program: followUpCaseProgram,
            ou: organisationUnit,
            fields: "*",
        },
    },
    indexCases: {
        resource: 'trackedEntityInstances',
        params: {
            program: indexCaseProgram,
            ou: organisationUnit,
            fields: "*",
            },
        },
    }
}

//iterate through API data and return list with data
function parseApiData(data, programId, baseUrl) {
    let parsedData = []

    data.map(person => {
        let dic = {}
        if (programId == indexCaseProgram){
            dic["program"] = "Index Case"
        }
        if (programId == followUpCaseProgram){
            dic["program"] = "Follow-up Case"
        }
        let ou = person.orgUnit 
        let tei = person.trackedEntityInstance
        dic["id"]=tei
        dic["url"] = baseUrl + tei + "&program="+ programId + "&ou=" + ou

        person.attributes.map(attributes =>{
            if (attributes.code == "first_name") {
                dic[attributes.code] = attributes.value
            }
            if (attributes.code == "surname") {
                dic[attributes.code] = attributes.value
            }
            if (attributes.code == "phone_local") {
                dic[attributes.code] = attributes.value
            }
            if (attributes.code == "e-mail") {
                dic["e_mail"] = attributes.value
            }
        })

        dic["relationships"] = []
        person.relationships.map(relationship =>{
            let toID = relationship.to.trackedEntityInstance.trackedEntityInstance
            let fromID = relationship.from.trackedEntityInstance.trackedEntityInstance
            let contactID = fromID == tei ? toID: fromID
            dic["relationships"].push(contactID)
        })

        let dueDate = ""
        person.enrollments.map(enrollment =>{
            enrollment.events.map(event=>{
                if(event.programStage == programStageFollowUp && event.status == "ACTIVE"){
                    dueDate = event.dueDate.split("T")[0]
                }
                if(event.programStage == programStageHealthStatus && event.status == "SCHEDULE"){
                    dueDate = event.dueDate.split("T")[0]
            }
            }
                )
            
        }
        )
        dic["dueDate"] = dueDate
                
        parsedData.push(dic)

    })
    return parsedData
}
function getAPIOuter() {
    const { baseUrl} = useConfig()
    const trackerCaptureUrl = `${baseUrl}/dhis-web-tracker-capture/index.html#/dashboard?tei=`
    const {error, loading, data } = useDataQuery(query())
    if (error) {
        return {error, loading, data}
    }
    if (loading) {
        return {error, loading, data}
    }
    let followUpCases = parseApiData(data.followUpCases.trackedEntityInstances, followUpCaseProgram, trackerCaptureUrl)
    let indexCases = parseApiData(data.indexCases.trackedEntityInstances, indexCaseProgram, trackerCaptureUrl)

    let mergedList = followUpCases.concat(indexCases)

    //Sorting dates
    mergedList = mergedList.sort(function(a,b){
        if (a.dueDate < b.dueDate) {
            return -1;
          }
          if (a.dueDate > b.dueDate) {
            return 1;
          }
          return 0;
    })
    return {error, loading, data:mergedList}
}

export default getAPIOuter