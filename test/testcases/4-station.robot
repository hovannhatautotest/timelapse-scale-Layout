*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1YBH5Dm-BQnMuFWWwyUBjf36T8-VKYULP_kF8MzaK7Gc/edit#gid=0 ###

### Check the User Interface of the Danh sách trạm cân page ###
ST_01 Verify UI display correct with the design
    [Tags]    MainPage    UI    Smoketest
   Login to admin
   When Click "QUẢN LÝ" menu
   And Click "Danh sách trạm cân" sub menu to "/station"
   Then Webpage should contain the list data from database
   And Webpage should contain the "Tìm kiếm" filter function

#ST_02 Verify UI display correct with design in window size of browser
#     [Tags]     MainPage      UI      Smoketest
#     Login to admin
#    When Click "QUẢN LÝ" menu
#    When Click "Danh sách trạm cân" sub menu to "/station"
#    Then Having fully function like the fullsize browser
#    Then Having the scroll bar if the content can not show out enough
#
##### Verify the search function ###
ST_03 Verify the search function when enter the existed name
    [Tags]      Search      Smoketest       BUG
    Go to "Danh sách trạm cân" page
    When Search "test name" in "Tìm kiếm" with "MIZA Đông Anh"
    Then "MIZA Đông Anh" should be visible in table line

ST_04 Verify the search function when enter the name was not available
    [Tags]      Search
    Go to "Danh sách trạm cân" page
    When Search "text" in "Tìm kiếm" with "_RANDOM_"
    Then Table line should show empty

*** Keywords ***
Go to "${page}" page
  Login to admin
  When Click "QUẢN LÝ" menu
  And Click "Danh sách trạm cân" sub menu to "/station"

Search "${type}" in "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //input
  Click                     ${element}
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}                       True
  Press Keys                ${element}                        Enter
  ${condition}=             Get Text                          ${element}
  WHILE    '${condition}' != '${text}'    limit=10
    Fill Text               ${element}                        ${text}
    ${condition}=           Get Text                          ${element}
  END
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

"${name}" should be visible in table line
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //*[contains(text(),'${name}')]
  Wait Until Element Is Existent                               ${element}

Webpage should contain the list data from database
  Log To Console    .
  Log To Console    *************************-List Of Weighing Stations-**************************
  ${elements}=               Get Elements                       //div[contains(@class,'ng-star-inserted')]//h2[contains(@class,'text-base')]
  ${count}=                  Set Variable        1
  FOR  ${i}  IN  @{elements}
       ${Name_Station}      Get Text      //div[${count}]/div[contains(@class,'border-gray-400')]/h2[contains(@class,'text-base')]
       ${Addresss}          Get Text      //div[${count}]/div[contains(@class,'border-gray-400')]/p[contains(@class,'text-sm')]
       Log To Console       Weighing station number ${count}
       Log To Console       Name Station: ${Name_Station}
       Log To Console       Address: ${Addresss}
       Log To Console       ------------------------------------------------------------------------------------------------------------------------
       ${count}=    Evaluate    ${count} + 1
  END

Table line should show empty
  Wait Until Element Is Existent                               //div[contains(@class,'h-[calc(100vh-180px)')]
  Get Property              //div[contains(@class,'h-[calc(100vh-180px)')]                innerText                equal            ${EMPTY}
