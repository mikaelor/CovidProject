import React, { useState } from "react";
import {Pagination} from "@dhis2/ui";
const PageHandler = (props, cases, display, size, pageCount, pageIncrement) =>{
    const [peopleAmount, setPeopleAmount] = useState(props.display[1])
    const [page, setPage] = useState(1)

    function changeSize(element){
        setPeopleAmount(element)
        props.size(element)
    }

    function changePage(element){
        props.pageIncrement(element)
        setPage(element)
    }

    return(
        <div>
            <Pagination
                dataTest="dhis2-uiwidgets-pagination"
                nextPageText={"Next"}
                previousPageText={"Previous"}
                onPageChange={(page) => {changePage(page)}}
                onPageSizeChange={(pageSize) => {
                    changeSize(pageSize), 
                    changePage(1)}
                }
                page={page}
                pageCount={props.pageCount}
                pageSelectText="Page"
                pageSize={peopleAmount}
                pageSizeSelectText="Cases Per Page"
                pageSizes={[
                    props.display[0].toString(),
                    props.display[1].toString(),
                    props.display[2].toString()
                ]}
                pageSummaryText={"Showing " + peopleAmount + " out of " + props.cases + " Cases"}
                total={2}
            >
            </Pagination>
        </div>
    )
}

export default PageHandler