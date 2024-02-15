*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          preconditions
Test Teardown       Tear Down

*** Test Cases ***
####Check the User Interface of the Supplier page
SP_01. Verify UI display correct with the design
    [Tags]        Supplier Page
    Then Heading should contain "Cổng 1" inner Text
    And Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    And Webpage should contain the list suppliers from database
    And Webpage should contain the "Ngày bắt đầu" filter function
    And Webpage should contain the "Ngày kết thúc" filter function
    And Webpage should contain "Tải lại dữ liệu" button

##SP_02. Verify UI display correct with design in window size of browser
##    [Tags]      Supplier Page
##    Then Having fully function like the fullsize browser
##    And Having the scroll bar if the content can not show out enough

SP_03. Verify the function navigate the list of supplier page
    [Tags]      Supplier Page
    When Move to the "next" page
    Then Webpage should contain the list suppliers from database
    When Move to the "previous" page
    Then Webpage should contain the list suppliers from database

#####Verify the filter function
CT_04. Verify the date selection filter function
    [Tags]      Filter
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    Then Webpage should contain the list suppliers from database
    When Enter date in placeholder "Ngày bắt đầu" with "${today}"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    Then Table line should show empty

#####Verify the reload data function
CT_05. Verify the reload data function
    [Tags]      Reload data
    When Click "Tải lại dữ liệu" button
    Then Webpage should contain the list suppliers from database

*** Keywords ***
preconditions
    Setup
    Go to "Danh sách trạm cân" page
    When Click select on frame "Cổng 1"
    And Click "Nhà cung cấp" tab button
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    And Enter date in placeholder "Ngày bắt đầu" with "2023-01-01"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    And Click "Tải lại dữ liệu" button

Go to "${page}" page
    Login to admin
    When Click "QUẢN LÝ" menu
    And Click "Danh sách trạm cân" sub menu to "/station"

Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    ${element}=               Get Element                      //i[contains(@class,'la-arrow-left')]
    ${count}=                 Get Element Count                  ${element}
    Should Be True            ${count} > 0

Webpage should contain the list suppliers from database
    Log To Console    .
    Log To Console    *************************-List Of Suppliers-**************************
    ${elements}=               Get Elements                       //tbody/*[contains(@class,'ng-star-inserted')]
    wait until element is visible         ${elements}[0]          ${BROWSER_TIMEOUT}
    ${count}=                   Set Variable        0
    ${NO}=                      Set Variable        1
    FOR  ${i}  IN  @{elements}
         ${name_elements}=                Get Elements                       //tbody/tr[1]/td[2]
         ${weigh_elements}=               Get Elements                       //tbody/tr[1]/td[3]
         ${name_impurities}=              Get Elements                       //tbody/tr[1]/td[4]
         ${name}=                         Get Text                          ${name_elements}[${count}]
         ${total_weigh}=                  Get Text                          ${weigh_elements}[${count}]
         ${impurities}=                   Get Text                          ${name_impurities}[${count}]
         Log To Console       Supplier Number ${NO}
         Log To Console       Tên: ${name} || Tổng KL: ${total_weigh} || KL Tạp chất: ${impurities}
         Log To Console       ------------------------------------------------------------------------------------------------------------------------
         ${count}=    Evaluate    ${count} + 1
         ${NO}=    Evaluate    ${NO} + 1
    END

Webpage should contain the "${name}" filter function
    IF    '${name}' == 'Ngày bắt đầu'
        ${element}=               Get Element                   //input[contains(@placeholder, "${name}")]
    ELSE IF    '${name}' == 'Ngày kết thúc'
        ${element}=               Get Element                   //input[contains(@placeholder, "${name}")]
    ELSE
        ${element}=               Get Element                   //*[contains(@ng-reflect-placeholder,'${name}')]
    END
    ${count}=                    Get Element Count                 ${element}
    Should Be True               ${count} >= 1

Table line should show empty
    ${element}=                   Get Element                   //div/g-pagination[contains(@ng-reflect-total, "0")]
    ${count}=                     Get Element Count             ${element}
    Should Be True               ${count} >= 1
