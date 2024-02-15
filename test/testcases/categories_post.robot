*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1cZhQbeh2IJzFWzTHMdGR0A_KvpYyA5WOEok3p9CgtIg/edit#gid=13564643 ###

### Check the User Interface of the Data page ###
CA_PO_01 Verify that navigating to the right "Categories Post" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
   Login to admin
   When Click "QUẢN LÝ DANH MỤC" menu
   When Click "Post" sub menu to "/post"
   Then Webpage should contain the list data from database

### Verify the creating data function ###
CA_PO_02 Verify "Tạo mới" button function
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Categories Post" page
    When Click "Tạo mới" button
    Then Confirm adding "/post/categories" page

CA_PO_03 Create new data with the valid post
    [Tags]                                                                                        Create                                       Smoketest
    Go to page create data "Post" with "/post"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Thêm mới danh mục bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

CA_PO_04 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Create another test data with "data Name"
    When Click on the "Xóa" button in the "data Name" item line

CA_PO_05 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Post" with "/post"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field

CA_DA_06 Create a new data when leaving "Tiêu đề" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Post" with "/post"
    When Enter "text" in "Slug" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field

### Create new data with invalid post ###
CA_PO_07 Create a new data with the invalid "Tiêu đề"
    [Tags]                                                                                        Create                                    Invalid
    Go to page create data "Post" with "/post"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Thêm mới danh mục bài viết thành công" popup
    When Click "Tạo mới" button
    When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Tiêu đề đã tồn tại" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

### Verify the funtion of changing data information ###
CA_PO_08 Verify the changing "Tiêu đề" field
    [Tags]                                                                                        ChangeInfo
    Create a test data 
    When Click on the "Sửa" button in the "_@Tiêu đề@_" item line
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

CA_PO_09 Verify the changing "Slug" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" item line
    When Enter "text" in "Slug" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

CA_PO_10 Verify the changing "Giới thiệu" field
    [Tags]                                                                                        ChangeInfo
    Create a test data
    When Click on the "Sửa" button in the "_@Tiêu đề@_" item line
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

### Verify the delete data function ###
CA_PO_11 Verify the delete data function
    [Tags]                                                                                        Delete                                       Smoketest
    Create a test data
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line

CA_PO_12 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a test data
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line with cancel
    When Click on the "Xóa" button in the "_@Tiêu đề@_" item line


*** Keywords ***
Go to "${page}" page
    Login to admin
    Click "QUẢN LÝ DANH MỤC" menu
    Click "Post" sub menu to "/post"

Go to page create data "${name}" with "${url}"
    When Login to admin
    When Click "QUẢN LÝ DANH MỤC" menu
    When Click "${name}" sub menu to "${url}"
    When Click "Tạo mới" button

Background ${type} Happy paths ${name} with ${url}
    When Go to page create data ${name} with ${url}
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button

Verify create data when inputting valid data into all fields
    [Arguments]    ${code}    ${name}    ${url}    ${type}
    Set Global Variable    ${TEST NAME}    ${code}
    When Background ${type} Happy paths ${name} with ${url}
    Then User look message "Thêm mới danh mục bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

Create a test data
    When Go to page create data "Post" with "/post"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    ${text}=    Check Text    _@Tiêu đề@_
    ${name}=    Set Variable    ${text}
    When Click "Lưu lại" button
    Then User look message "Thêm mới danh mục bài viết thành công" popup
    RETURN    ${name}

Create another test data with "${name}"
    When Go to page create data "Post" with "/post"
    When Enter "test name" in "Tiêu đề" with "${name}"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    ${text}=    Check Text    _@Tiêu đề@_
    ${nameS}=    Set Variable    ${text}
    When Click "Lưu lại" button
    Then User look message "Thêm mới danh mục bài viết thành công" popup
    RETURN    ${nameS}

Create random test data
    [Arguments]    ${code}    ${accName}    ${URL}    ${acctype}
    Set Global Variable    ${TEST NAME}    ${code}
    When Go to page create data "${accName}" with "${URL}"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Thêm mới danh mục bài viết thành công" popup
