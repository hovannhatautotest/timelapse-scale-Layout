*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1cZhQbeh2IJzFWzTHMdGR0A_KvpYyA5WOEok3p9CgtIg/edit#gid=36963030 ###

### Check the User Interface of the Navigation page ###
DH_01 Verify that navigating to the right "Navigation" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
   Login to admin
   When Click "SUPERADMIN" menu
   When Click "Phân quyền điều hướng" sub menu to "/navigation"

### Verify the creating data function ###
DH_02 Verify "Tạo mới" button function
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Navigation" page
    When Click "Tạo mới" button

DH_03 Create new data with the valid navigation
    [Tags]                                                                                        Create                                      Smoketest   BUG
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_04 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest    BUG
    Go to "Navigation" page
    When Create another test data
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

### Create new data with blank field ###
DH_05 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tên điều hướng" displayed under "Tên điều hướng" field
    Then Required message "Xin vui lòng nhập mã điều hướng" displayed under "Mã điều hướng" field
    Then Required message "Xin vui lòng nhập link" displayed under "Link" field
    Then Required message "Xin vui lòng nhập số thứ tự" displayed under "Số thứ tự" field

DH_06 Create a new data when leaving "Tên điều hướng" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tên điều hướng" displayed under "Tên điều hướng" field

DH_07 Create a new data when leaving "Mã điều hướng" field blank
    [Tags]                                                                                        Create                                       BlankField   BUG
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập mã điều hướng" displayed under "Mã điều hướng" field

DH_08 Create a new data when leaving "Link" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập link" displayed under "Link" field

DH_09 Create a new data when leaving "Số thứ tự" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập số thứ tự" displayed under "Số thứ tự" field

### Create new data with invalid data ###
DH_10 Create a new data with the invalid "Mã điều hướng"
    [Tags]                                                                                        Create                                       Invalid
    ${name1}=                                                                               Create a test data 
    When Click "Tạo mới" button
    When Enter "test name" in "Tên điều hướng" with "_RANDOM__"
    When Enter "text" in "Mã điều hướng" with "FAQS"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Mã: FAQS đã tồn tại" popup
    When Click on the previously created "${name1}" tree to delete

### Verify the funtion of changing data information ###
DH_11 Verify the changing "Tên điều hướng" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_12 Verify the changing "Mã điều hướng" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_13 Verify the changing "Link" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "text" in "Link" with "/_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_14 Verify the changing "Số thứ tự" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_15 Verify the changing "Biểu tượng" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "text" in "Biểu tượng" with "las la-blind"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_16 Verify the changing "Tham số truy vấn" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_17 Verify the changing "Kích hoạt" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Click switch "Kích hoạt" to be activated
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_18 Verify the changing "Gán nhóm" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to edit
    When Click unassign list "Farmer Side, Order Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_19 Verify the changing with the existed "Mã điều hướng"
    [Tags]                                                                                        ChangeInfo    BUG
    ${name1}=                                                                               Create a test data 
    When Click on the previously created "${name1}" tree to edit
    When Enter "text" in "Mã điều hướng" with "FAQS"
    When Click "Lưu lại" button
    Then User look message "Mã: FAQS đã tồn tại" popup
    When Click on the previously created "${name1}" tree to delete

### Verify the search data function ###
DH_20 Verify the search function when enter the existed name
    [Tags]                                                                                        Search                                     Smoketest   BUG
    Create a test data
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "_@Tên điều hướng@_"
    Then "_@Tên điều hướng@_" should be visible in the tree line
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_21 Verify the search function when enter the name was not existed
    [Tags]                                                                                        Search                                    Smoketest   BUG1
    Create a test data
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "_@Tên điều hướng@_"
    Then "_@Tên điều hướng@_" should not be visible in the tree line
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with ""
    Then "_@Tên điều hướng@_" should be visible in the tree line
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_22 Check the update of data list after cancel the search action
    [Tags]                                                                                        Search                                     Smoketest   BUG1
    ${name1}=                                                                               Create a test data 
    Create another test data 
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with "${name1}"
    Then "_@Tên điều hướng@_" should not be visible in the tree line
    When Enter "test name" in placeholder "Nhập để tìm kiếm" with ""
    Then "_@Tên điều hướng@_" should be visible in the tree line
    When Click on the previously created "${name1}" tree to delete
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

### Verify the delete data function ###
DH_23 Verify the delete data function
    [Tags]                                                                                        Delete                                       Smoketest
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_24 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a test data
    When Click on the previously created "_@Tên điều hướng@_" tree to delete with cancel
    When Click on the previously created "_@Tên điều hướng@_" tree to delete


*** Keywords ***
Go to "${page}" page
    Login to admin
    Click "SUPERADMIN" menu
    Click "Phân quyền điều hướng" sub menu to "/navigation"

Go to page create data "${name}" with "${url}"
    When Login to admin
    When Click "SUPERADMIN" menu
    When Click "${name}" sub menu to "${url}"
    When Click "Tạo mới" button

Background ${type} Happy paths ${name} with ${url}
    When Go to page create data ${name} with ${url}
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Click tree select "Điều hướng cha" with "SUPERADMIN"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup

Verify create data when inputting valid data into all fields
    [Arguments]    ${code}    ${name}    ${url}    ${type}
    Set Global Variable    ${TEST NAME}    ${code}
    When Background ${type} Happy paths ${name} with ${url}
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tên điều hướng@_" table line

Create a test data
    When Go to page create data "Phân quyền điều hướng" with "/navigation"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    ${text}=    Check Text    _@Tên điều hướng@_
    ${name}=    Set Variable    ${text}     
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${name}  


Create another test data
    When Click "Tạo mới" button
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    ${text}=    Check Text    _@Tên điều hướng@_
    ${nameS}=    Set Variable    ${text}
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    RETURN    ${nameS}

Create random test data
    [Arguments]    ${code}    ${accName}    ${URL}    ${acctype}
    Set Global Variable    ${TEST NAME}    ${code}
    When Go to page create data "${accName}" with "${URL}"
    When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
    When Enter "word" in "Mã điều hướng" with "_RANDOM_"
    When Enter "text" in "Link" with "/_RANDOM_"
    When Enter "number" in "Số thứ tự" with "_RANDOM_"
    When Enter "text" in "Biểu tượng" with "las la-folder-minus"
    When Enter "text" in "Tham số truy vấn" with "_RANDOM_"
    When Click switch "Kích hoạt" to be activated
    When Click assign list "Order Side, Farmer Side"
    When Click "Lưu lại" button
    Then User look message "Success" popup
