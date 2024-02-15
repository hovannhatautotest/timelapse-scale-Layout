*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1cZhQbeh2IJzFWzTHMdGR0A_KvpYyA5WOEok3p9CgtIg/edit#gid=775904758 ###

### Check the User Interface of the Parameter page ###
CH_01 Verify that navigating to the right "Parameter" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
   Login to admin
   When Click "SUPERADMIN" menu
   When Click "Cấu hình hệ thống" sub menu to "/parameter"

### Verify the creating data function ###
CH_02 Verify "Tạo mới" button function
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Parameter" page
    When Click "Tạo mới" button

CH_03 Create new data with the valid parameter
    [Tags]                                                                                        Create                                      Smoketest   BUG
    Go to page create data "Cấu hình hệ thống" with "/parameter"
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_04 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Parameter" page
    When Create another test data
    When Click on the previously created "_@Tên tham số@_" tree to delete

### Create new data with blank field ###
CH_05 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Cấu hình hệ thống" with "/parameter"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tên tham số" displayed under "Tên tham số" field
    Then Required message "Xin vui lòng nhập giá trị tham số" displayed under "Giá trị tham số" field

CH_06 Create a new data when leaving "Tên tham số" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Cấu hình hệ thống" with "/parameter"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tên tham số" displayed under "Tên tham số" field

CH_07 Create a new data when leaving "Giá trị tham số" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Cấu hình hệ thống" with "/parameter"
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập giá trị tham số" displayed under "Giá trị tham số" field

### Verify the funtion of changing data information ###
CH_08 Verify the changing "Tên tham số" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_09 Verify the changing "Giá trị tham số" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_10 Verify the changing "Nhóm" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_11 Verify the changing "Ghi chú" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên tham số@_" tree to edit
    When Click on the previously created "_@Tên tham số@_" tree to delete

### Verify the search data function ###
CH_12 Verify the search function when enter the existed name
    [Tags]                                                                                        Search                                     Smoketest   BUG
    Create a test data
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "_@Tên tham số@_"
    Then "_@Tên tham số@_" should be visible in the tree line
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_13 Verify the search function when enter the name was not existed
    [Tags]                                                                                        Search                                    Smoketest   BUG1
    Create a test data
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "opp"
    When Click on magnifier icon in search box
    Then "_@Tên tham số@_" should not be visible in the tree line
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "_@Tên tham số@_"
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_14 Check the update of data list after cancel the search action
    [Tags]                                                                                        Search                                     Smoketest   BUG1
    ${name1}=                                                                               Create a test data 
    Create another test data 
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "${name1}"
    When Click on magnifier icon in search box
    Then "_@Tên tham số@_" should not be visible in the tree line
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "_@Tên tham số@_"
    When Click on the previously created "_@Tên tham số@_" tree to delete
    When Click on the previously created "${name1}" tree to delete

### Verify the delete data function ###
CH_15 Verify the delete data function
    [Tags]                                                                                        Delete                                       Smoketest
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to delete

CH_16 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a test data
    When Click on the previously created "_@Tên tham số@_" tree to delete with cancel
    When Click on the previously created "_@Tên tham số@_" tree to delete


*** Keywords ***
Go to "${page}" page
    Login to admin
    Click "SUPERADMIN" menu
    Click "Cấu hình hệ thống" sub menu to "/parameter"

Go to page create data "${name}" with "${url}"
    When Login to admin
    When Click "SUPERADMIN" menu
    When Click "${name}" sub menu to "${url}"
    When Click "Tạo mới" button

Background ${type} Happy paths ${name} with ${url}
    When Go to page create data ${name} with ${url}
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup

Verify create data when inputting valid data into all fields
    [Arguments]    ${code}    ${name}    ${url}    ${type}
    Set Global Variable    ${TEST NAME}    ${code}
    When Background ${type} Happy paths ${name} with ${url}
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tên tham số@_" table line

Create a test data
    When Go to page create data "Cấu hình hệ thống" with "/parameter"
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    ${text}=    Check Text    _@Tên tham số@_
    ${name}=    Set Variable    ${text}
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${name}

Create another test data
    When Click "Tạo mới" button
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    ${text}=    Check Text    _@Tên tham số@_
    ${nameS}=    Set Variable    ${text}
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${nameS}

Create random test data
    [Arguments]    ${code}    ${accName}    ${URL}    ${acctype}
    Set Global Variable    ${TEST NAME}    ${code}
    When Go to page create data "${accName}" with "${URL}"
    When Enter "test name" in "Tên tham số" with "_RANDOM_"
    When Enter "text" in "Giá trị tham số" with "_RANDOM_"
    When Enter "word" in "Nhóm" with "_RANDOM_"
    When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
