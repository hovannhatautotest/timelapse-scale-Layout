*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases  https://docs.google.com/spreadsheets/d/1DbP64bT7QpASuE3NeiIVDdeHpdrKQon3HqF9rsUzbFU/edit#gid=1362571637 ###

### Check the User Interface of the Data page ###
DA_01 Verify that navigating to the right "Data" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
    Login to admin
    When Click "QUẢN LÝ DANH MỤC" menu
    When Click "Quản lý dữ liệu" sub menu to "/data"
    Then Confirm locating exactly in "Quản lý dữ liệu" page
    Then Webpage should contain the list data from database
    Then Webpage should contain the search function
    Then Webpage should contain "Thêm mới dữ liệu" button

DA_02 Verify the function changing the number of data show in each list
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
    Go to "Quản lý dữ liệu" page 
    When Click on "second" selection to change the number of data show in list and check
    When Click on "third" selection to change the number of data show in list and check
    When Click on "fourth" selection to change the number of data show in list and check
    When Click on "fifth" selection to change the number of data show in list and check

DA_03 Verify the function navigating to other lists of data page
    [Tags]                                                                                        MainPage                                    UI                                          Smoketest
    Go to "Quản lý dữ liệu" page
    Create a category
    Then Check the amount of page list
    ${Last_name}=                                                                                 Get data in the last row 
    Create a test data with "_@Tên loại@_" type
    When Move to the "next" page
    ${First_name}=                                                                                Get data in the first row
    Should Be Equal                                                                               ${Last_name}                                ${First_name}
    When Move to the "previous" page
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    Then Move to the last page and check
    When Click on the "Xóa" button in the "_@Tên loại@_" item line 

DA_04 Verify the highlight table line function after operated
    [Tags]                                                                                        MainPage                                    UI
    Create a category  
    Create a test data with "_@Tên loại@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click "Đóng lại" button
    Then "_@Tiêu đề@_" table line should be highlighted
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the correct design in detail information's Data page ###
DA_05 Verify that navigating to the right "Edit data" page
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Heading should contain "Chỉnh sửa dữ liệu" inner Text
    Then Webpage should contain "Chuyên mục" select field
    Then Webpage should contain "Tiêu đề" input field
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_06 Check data information after creation
    [Tags]                                                                                        DetailedInfo                                UI                                           Smoketest
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information in "Chuyên mục" should be equal "_@Tên loại@_"
    Then Data's information in "Thứ tự" should be equal "_@Thứ tự@_"
    Then Data's information in "Tiêu đề" should be equal "_@Tiêu đề@_"
    Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
    Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the go back button in the detail information's data page ###
DA_07 Verify the "Đóng lại" button
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    When Click "Trở lại" button
    Then Confirm locating exactly in "Quản lý dữ liệu" page
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_08 Verify the "Left-arrow" button
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    When Click on the left arrow icon
    Then Confirm locating exactly in "Quản lý dữ liệu" page
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the search function ###
DA_09 Verify the search function when enter the existed name
    [Tags]                                                                                        Search                                      Smoketest
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Enter "test name" in "Tìm kiếm" with "_@Tiêu đề@_"
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_10 Verify the search function when enter the name was not existed
    [Tags]                                                                                        Search                               
    Create a category 
    Create a test data with "_@Tên loại@_" type    
    When Enter "text" in "Tìm kiếm" with "_RANDOM_"
    When Click on magnifier icon in search box
    Then Table line should show empty
    When Enter "test name" in "Tìm kiếm" with ""
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_11 Check the update of data list after cancel the search action
    [Tags]                                                                                        Search                              
    Create a category 
    ${Data1}=                                                                                     Create a test data with "_@Tên loại@_" type 
    Create a test data with "_@Tên loại@_" type    
    When Enter "text" in "Tìm kiếm" with "${Data1}"
    When Click on magnifier icon in search box
    Then "${Data1}" should be visible in table line
    Then "_@Tiêu đề@_" should not be visible in table line
    When Click on the "Xóa" button in the "${Data1}" table line
    When Enter "text" in "Tìm kiếm" with ""
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@__" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the creating data function ###
DA_12 Verify "Thêm mới dữ liệu" button function
    [Tags]                                                                                        Create                                         Smoketest
    Go to "Quản lý dữ liệu" page
    Create a category
    When Click "Thêm mới dữ liệu" button
    Then Heading should contain "Thêm mới dữ liệu" inner Text
    Then Confirm adding "/data" page
    Then Webpage should contain "Chuyên mục" select field
    Then Webpage should contain "Thứ tự" input field
    Then Webpage should contain "Tiêu đề" input field
    Then Webpage should contain "Mô tả" input field
    Then Webpage should contain "Nội dung" input field
    Then Webpage should contain "Lưu lại" button
    Then Webpage should contain "Đóng lại" button
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_13 Create new data with the valid data
    [Tags]                                                                                        Create                                       Smoketest
    Create a category
    When Click "Thêm mới dữ liệu" button
    When Click select "Chuyên mục" with "_@Tên loại@_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_14 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Create a category
    When Click "Thêm mới dữ liệu" button
    When Click select "Chuyên mục" with "_@Tên loại@_"
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
    When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Success" popup
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Create new data with blank field ###
DA_15 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField   BUG
    Go to page create data "Quản lý dữ liệu" with "/data"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng chọn chuyên mục" displayed under "Chuyên mục" field
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field

DA_16 Create a new data when leaving "Chuyên mục" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Quản lý dữ liệu" with "/data"
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng chọn chuyên mục" displayed under "Chuyên mục" field

DA_17 Create a new data when leaving "Tiêu đề" field blank
    [Tags]                                                                                        Create                                       BlankField
    Go to page create data "Quản lý dữ liệu" with "/data"
    When Click select "Chuyên mục" with "Test"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field

### Create new data with invalid data ###
DA_18 Create a new data with the invalid "Tiêu đề"
    [Tags]                                                                                        Create                                    Invalid    BUG
    Create a category 
    Create a test data with "_@Tên loại@_" type     
    When Click "Thêm mới dữ liệu" button
    When Click select "Chuyên mục" with "_@Tên loại@_"
    When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
    When Click "Lưu lại" button
    Then User look message "Tiêu đề đã tồn tại" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the go back button in the creating data page  ###
DA_19 Verify the "Đóng lại" button
    [Tags]                                                                                        Create                                      Invalid    BUG
    Go to page create data "Quản lý dữ liệu" with "/data"
    When Click "Đóng lại" button
    Then Confirm locating exactly in "Quản lý dữ liệu" page
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database

DA_20 Verify the "Left-arrow" button
    [Tags]                                                                                        Create                                      Invalid    BUG
    Go to page create data "Quản lý dữ liệu" with "/data"
    When Click on the left arrow icon
    Then Confirm locating exactly in "Quản lý dữ liệu" page
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database

### Verify the funtion of changing data information ###
DA_21 Verify the changing "Chuyên mục" field
    [Tags]                                                                                        ChangeInfo                                                    
    ${Cate1}=                                                                                     Create a category
    Create a category
    Create a test data with "_@Tên loại@_" type
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click select "Chuyên mục" with "${Cate1}"
    When Click "Lưu lại" button
    Then User look message "Cập nhật thành công" popup
    When Select on the "${Cate1}" item line
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line
    When Click on the "Xóa" button in the "${Cate1}" item line

DA_22 Verify the changing "Thứ tự" field
    [Tags]                                                                                        ChangeInfo    
    Create a category
    Create a test data with "_@Tên loại@_" type
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "number" in "Thứ tự" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật thành công" popup
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information in "Thứ tự" should be equal "_@Thứ tự@_"
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_23 Verify the changing "Tiêu đề" field
    [Tags]                                                                                        ChangeInfo     
    Create a category
    Create a test data with "_@Tên loại@_" type
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_24 Verify the changing "Mô tả" field
    [Tags]                                                                                        ChangeInfo                   BUG1     
    Create a category
    Create a test data with "_@Tên loại@_" type
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in textarea "Mô tả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật thành công" popup
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information in "Mô tả" should be equal "_@Mô tả@_"
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

DA_25 Verify the changing "Nội dung" field
    [Tags]                                                                                        ChangeInfo                    BUG1    
    Create a category
    Create a test data with "_@Tên loại@_" type
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật thành công" popup
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information in "Nội dung" should be equal "_@Nội dung@_"
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line

### Verify the button's function in the edit information page ###
DA_26 Verify the "Đóng lại" button
    [Tags]                                                                                        ChangeInfo
    Create a category
    Create a test data with "_@Tên loại@_" type        
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click "Đóng lại" button
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line 

DA_27 Verify the "Left-arrow" button
    [Tags]                                                                                        ChangeInfo
    Create a category 
    Create a test data with "_@Tên loại@_" type        
    When Select on the "_@Tên loại@_" item line
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click on the left arrow icon
    Then Webpage should contain "Thêm mới dữ liệu" button
    Then Webpage should contain the list data from database
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line 

### Verify the delete data function ###
DA_28 Verify the delete data function
    [Tags]                                                                                        Delete                                      Smoketest
    Create a category
    Create a test data with "_@Tên loại@_" type       
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    Then User look message "Xóa thành công" popup
    Then "_@Tiêu đề@_" should not be visible in table line
    When Click on the "Xóa" button in the "_@Tên loại@_" item line    
    

DA_29 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a category 
    Create a test data with "_@Tên loại@_" type  
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line with cancel
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    Then User look message "Xóa thành công" popup
    When Click on the "Xóa" button in the "_@Tên loại@_" item line  

*** Keywords ***
Go to "Quản lý dữ liệu" page
    Login to admin
    Click "QUẢN LÝ DANH MỤC" menu
    Click "Quản lý dữ liệu" sub menu to "/data"

Go to page create data "${name}" with "${url}"
  Login to admin
  Click "QUẢN LÝ DANH MỤC" menu
  Click "${name}" sub menu to "${url}"
  Click "Thêm mới dữ liệu" button

Create a category
  ${condition}=          Run Keyword And Return Status                Confirm locating exactly in "Quản lý dữ liệu" page
  IF    '${condition}' == 'True'
    Click "Tạo mới" button
  ELSE
    Go to "Quản lý dữ liệu" page
    Click "Tạo mới" button  
  END
  Enter "test name" in "Tên loại" with "_RANDOM_"
    ${text}=             Check Text                                    _@Tên loại@_
    ${name}=             Set Variable                                  ${text}
    [Return]             ${text}
  Enter "number" in "Mã" with "_RANDOM_"
  Click "Lưu lại" button
  User look message "Success" popup

Create a test data with "${type}" type
  ${condition}=          Run Keyword And Return Status                 Confirm locating exactly in "Quản lý dữ liệu" page
  IF    '${condition}' == 'True'
    Click "Thêm mới dữ liệu" button
  ELSE
    Go to page create data "Quản lý dữ liệu" with "/data"  
  END
  Click select "Chuyên mục" with "${type}"
  Enter "number" in "Thứ tự" with "_RANDOM_"
  Enter "test name" in "Tiêu đề" with "_RANDOM_"
    ${text}=             Check Text                                    _@Tiêu đề@_
    ${name}=             Set Variable                                  ${text}
    [Return]             ${text}
  Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
  Click "Lưu lại" button
  User look message "Success" popup