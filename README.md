# Readme
Group 4: andrehus, gwendob, ninasjus, mikaelor

The application is an implementation for Case 1 - Working list. 
## Functionality
- Fundamental requirements:
    - Show an overview of index cases and contacts to be contacted on a particular day (default = today), both cases and contacts together in the same list and separately. 
    - From the list, it should be possible to go directly to the data entry form for a specific case (by opening the Tracker Capture app for that particular case).
    - It should be possible to generate an overview of the workload for the coming days, i.e. number of follow-up calls to be made by day in the next e.g. 5,7,14 days (based on scheduled events in the index and contact programmes).


- Additional requirements that we have implemented:
    - From the main table it should be possible to show a “sub-view” with contacts linked to the same case.
    - Index cases and follow up cases that have not been contacted yet should automatically be moved to the next day to improve workflow. 
    - Cases that already have had due date should be listed at the top of the table.
    - It should be possible to differentiate the urgency of the cases with color-coding.
    - The app should take into account universal design
        - The cases with highest priority should also be marked with an icon (ref. dhis2 design principles). 
        - The app should provide responsive design, enabling zooming and adjusting pages. 
    - The app should provide a search filter to search for specific names in the list. 
    - The app should provide pagination to let the user adjust the number of cases being shown per page. 
    - It should be possible to click on a specific future day and get the cases with due date on that given day.
 
## Implementation
### Today
‘Today’ contains a list of cases to be contacted for today. Each case displays information of name, phone number, case type/program, due date. A case also has a ‘Show contacts’ button that lets the user navigate to a subview of the contacts belonging to the specific case. By clicking the closing icon, it is possible to close the subview again. The ‘Tracker capture’ button in the table lets the user navigate to the respective tracker capture website.
The list includes overdue cases if they haven’t been contacted yet. Cases that have been contacted will not appear in the list. Cases that are overdue have a red colored due date, and orange if the due date was just yesterday. The orange color is meant to indicate that the due date is less urgent than the red one. 
It is also possible to filter the cases showing on the list with the ‘chips’ displayed under the date-header. The chips are ‘All cases’, ‘Index cases’ and ‘Follow-up cases’. The search bar makes it possible to search for names in the list. If the person that searches is not certain of the name, it is possible to search on parts of the name as well. If there are many cases, it is possible to set the number of cases to be shown for each page and it is possible to navigate through the list in pages. This is managed with the use of the component ‘Pagination’.
 
### Week
When clicking ‘Week’, a schedule of the workload for the current week appears. Every day is represented by  its own card that displays the number of cases for that given day. It also specifies which type of cases there are on that day. Days that have passed in the current week are disabled, constraining the user to focus or click on them. Today’s date is colored in blue. By clicking the navigation icons, it is possible to view the following two weeks workflow as well. 

Clicking on the “Number of cases” of each day, will redirect you to a list of contacts for that day similar to the list in ‘Today’. There might also be some days with no cases that will not be possible to click on as they would only display an empty list of cases.

### Description of each file
#### App.js
This is the file that starts running when opening the project. It fetches API from CaseHandler.js and sends it further to Menu.js. The API is not being fetched again until reloading the page.
#### CaseHandler.js
Fetches API from hardcoded organisation unit 'Klepp Kommune' and returns a list with all the data that we considered relevant.
#### Menu.js
This is where the navigation for the sites 'Today' and 'Week' is handled. Menu.js is styled in the Menu.module.css file.
#### Table.js
Table.js renders the table for index cases and follow-up cases that are supposed to be contacted and followed up on a given day. When opening the app, the table will be loaded for today by default. Further, the table will be rendered when clicking on ‘Today’ in the menu and when clicking on a specific day from the week schedule in ‘Schedule.js’. Table is styled in the Table.module.css file.
#### Relations.js
Relations.js handles rendering the table containing all contacts of a given case. This smaller table is owned by Table.js and will only appear when clicking on the ‘Show contacts’ buttons from the main table (Table.js). Relations.js is also styled in the Table.module.css file.
#### FilterByDate.js
FilterByDate.js contains only backend functionality. When given a list of cases and a specific date, the function filters the list to only contain cases with due date on the given date.
#### Schedule.js
Schedule.js contains code for the weekly schedule that can be accessed from the menu by clicking on ‘Week’. By clicking on the card of a given day, the app will redirect you to a table view of the given day with all the cases that have a due date on that day. Schedule.js is styled in the Schedule.module.css file. 
#### Pager.js
Contains the implementation of Pagination.

## Missing functionality
### Search for case on Schedule.js
When showing the weekly workload we wanted a search bar similar to the one in Table.js. This was supposed to enable searching for a name despite not knowing which day the case is to be contacted. 
### Number of contacts belonging to case
In the assignment text there was a possible additional requirement to show the number of contacts of each case. We do show the contacts, but we don’t give the number. We found it hard to give the number of contacts and still keep a good design, but we would definitely find a way to show the number of contacts given more time.
## What does not work optimally
- When filtering case type (program, index cases or follow-up cases), the number of cases shown on a site could be less than the number of cases that should be shown. The pagination doesn’t consider the filtering of ‘Index case’ and ‘Follow-up case’. This is partly intentional but could be improved.
- Responsiveness could also be improved. Right now, the weekly schedule does not take into consideration zooming out for example. 
- Currently, the subview of contacts linked to a specific person from the table is sticky. This is supposed to improve usability. The table header is not sticky. If there are many cases, one might have to scroll to the top of the table again. However, as we implemented pagination, we did not consider sticky table header as very important.
- The interaction with the registered API is not optimal, but we would say the registration system should improve on these points and not our application:
    - There is a possibility in the system that a case is deleted, but won’t be removed if they appear in the relationships of any other case. In that case the ‘Show contacts’-button will appear even though that removed case was the only relation. The ‘Show Contacts’-button is dependent on the relationships list. If that list is empty it will then appear ‘No contacts’ instead of a button. That mentioned possibility is rather a fault in the registration system. A case that is deleted should be deleted on relationships appearances as well.
    - If a person is enrolled in both index case and follow-up case that should be a fault in the registration system. We haven't considered double enrollment in our program and the person will then show up twice as both cases. This should also be a problem handled by the registration system. 
