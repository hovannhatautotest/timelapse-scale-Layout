*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1cZhQbeh2IJzFWzTHMdGR0A_KvpYyA5WOEok3p9CgtIg/edit#gid=350270439 ###

### Check the User Interface of the Code-type page ###
CO_01 Verify that navigating to the right "Code-Type" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
   Login to admin
   When Click "QUẢN LÝ DANH MỤC" menu
   When Click "Danh mục" sub menu to "/code-type"
   Then Webpage should contain the list data from database
   Then Webpage should contain the search function
   Then Webpage should contain "Thêm mới" button

CO_02 Verify the function changing the number of data show in each list
    [Tags]                                                                                        MainPage                   BUG1                  UI                                          Smoketest
    Go to "Code-Type" page
    When Click on "second" selection to change the number of data show in list and check
    When Click on "third" selection to change the number of data show in list and check
    When Click on "fourth" selection to change the number of data show in list and check
    When Click on "fifth" selection to change the number of data show in list and check

CO_03 Verify the function navigating to other lists of data page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
    Go to "Code-Type" page
    When Create another test data
    When Move to the "next" page
    When Move to the "previous" page
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    Then Move to the last page and check

CO_04 Verify the highlight table line function after operated
    [Tags]                                                                                        MainPage                                     UI
    Go to "Code-Type" page
    Create another test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

### Verify the correct design in detail information's Code-Type page ###
CO_05 Verify that navigating to the right "Edit code-type" page
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a test data
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Heading should contain "Chỉnh sửa Nhóm thủ thuật" inner Text
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_06 Check data information after creation
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a test data
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information should contain "Tiêu đề" field
    Then Data's information should contain "Thứ tự" field
    Then Data's information should contain "Mã" field
    Then Data's information should contain "Mô tả" field
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

### Verify the search function ###
CO_07 Verify the search function when enter the existed name
    [Tags]                                                                                        Search                                       Smoketest    BUG
    Create a test data
    When Enter "test name" in "Tìm kiếm" with "_@Tiêu đề@_"
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_08 Verify the search function when enter the name was not existed
    [Tags]                                                                                        Search
    Create a test data
    When Enter "text" in "Tìm kiếm" with "opp"
    When Click on magnifier icon in search box
    Then Table line should show empty
    When Enter "test name" in "Tìm kiếm" with "_@Tiêu đề@_"
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_09 Check the update of data list after cancel the search action
    [Tags]                                                                                        Search
    ${AccountName}=                                                                               Create a test data
    Create another test data
    When Enter "text" in "Tìm kiếm" with "${AccountName}"
    When Click on magnifier icon in search box
    Then "${AccountName}" should be visible in table line
    Then "_@Tiêu đề@_" should not be visible in table line
    When Enter "text" in "Tìm kiếm" with ""
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "${AccountName}" table line

### Verify the creating data function ###
CO_10 Verify "Thêm mới" button function
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Code-Type" page
    When Click "Thêm mới" button
    Then Heading should contain "Thêm mới Nhóm thủ thuật" inner Text
    Then Confirm adding "/code-types/MEDICAL_PROCEDURE_GROUP" page

CO_11 Create new data with the valid code-type
    [Tags]                                                                                        Create                                       Smoketest
    Go to page create data "Danh mục" with "/code-types"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_12 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Code-Type" page
    When Create another test data
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

### Create new data with blank field ###
CO_13 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Danh mục" with "/code-types"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field
    Then Required message "Xin vui lòng nhập mã" displayed under "Mã" field

CO_14 Create a new data when leaving "Tiêu đề" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Danh mục" with "/code-types"
    When Enter "text" in "Mã" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field

CO_15 Create a new data when leaving "Mã" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Danh mục" with "/code-types"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập mã" displayed under "Mã" field

### Create new data with invalid data ###
CO_16 Create a new data with the invalid "Mã"
    [Tags]                                                                                        Create                                       Invalid
    Go to page create data "Danh mục" with "/code-types"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click "Thêm mới" button
    When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_@Mã@_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Code đã tồn tại" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

### Verify the funtion of changing data information ###
CO_17 Verify the changing "Tiêu đề" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_18 Verify the changing "Thứ tự" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_19 Verify the changing "Mô tả" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

### Verify the delete data function ###
CO_20 Verify the delete data function
    [Tags]                                                                                        Delete                                       Smoketest
    Create a test data
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

CO_21 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a test data
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line with cancel
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line


*** Keywords ***
Go to "${page}" page
    Login to admin
    Click "QUẢN LÝ DANH MỤC" menu
    Click "Danh mục" sub menu to "/code-types"

Go to page create data "${name}" with "${url}"
    When Login to admin
    When Click "QUẢN LÝ DANH MỤC" menu
    When Click "${name}" sub menu to "${url}"
    When Click "Thêm mới" button

Background ${type} Happy paths ${name} with ${url}
    When Go to page create data ${name} with ${url}
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button

Verify create data when inputting valid data into all fields
    [Arguments]    ${code}    ${name}    ${url}    ${type}
    Set Global Variable    ${TEST NAME}    ${code}
    When Background ${type} Happy paths ${name} with ${url}
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

Create a test data
    When Go to page create data "Danh mục" with "/code-types"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    ${text}=    Check Text    _@Tiêu đề@_
    ${name}=    Set Variable    ${text}
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${name}

Create another test data
    When Click "Thêm mới" button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    ${text}=    Check Text    _@Tiêu đề@_
    ${nameS}=    Set Variable    ${text}
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${nameS}

Create random test data
    [Arguments]    ${code}    ${accName}    ${URL}    ${acctype}
    Set Global Variable    ${TEST NAME}    ${code}
    When Go to page create data "${accName}" with "${URL}"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "text" in "Mã" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
