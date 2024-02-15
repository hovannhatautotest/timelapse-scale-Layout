*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1YBH5Dm-BQnMuFWWwyUBjf36T8-VKYULP_kF8MzaK7Gc/edit#gid=2094605949 ###

### Check the User Interface of the Chart page  ###
CH_01 Verify UI display correct with the design
    [Tags]      MainPage      UI     Smoketest
   Go to "Danh sách trạm cân" page
  #  When Click on the "Miza Nghi Sơn"
   When Click "Biều đồ" tab button
   Then Webpage should contain the list data from database
   Then Webpage should contain the "Khách hàng" filter function
   Then Webpage should contain the "Đối tác" filter function
   Then Webpage should contain the "Mặt hàng" filter function
   Then Webpage should contain the "Ngày" filter function
   Then Webpage should contain "Xuất báo cáo Excel" button
   Then Webpage should contain "Tải lại dữ liệu" button

#### Verify the filter function ###
#CH_04 Verify the "Khách hàng" filter function when select "_@Bên mua@_"
#    [Tags]      Filter      Smoketest    BUG
#    Create a test data
#    Go to "Danh sách trạm cân " page
#    Click "Biểu đồ" tab button
#    When Click filter "Khách hàng" with "_RANDOM_"
#    Then "_@Bên mua@_" should not be visible in table line
#    When Click filter "Khách hàng" with "_@Bên mua@_"
#    Then "_@Bên mua@_" should be visible in table line
#
#CH_05 Verify the "Đối tác" filter function when select "_@Bên bán@_"
#    [Tags]        Filter      Smoketest    BUG
#    Create a test data
#    Go to "Danh sách trạm cân " page
#    Click "Biểu đồ" tab button
#    When Click filter "Đối tác" with "_RANDOM_"
#    Then "_@Bên bán@_" should not be visible in table line
#    When Click filter "Đối tác" with "_@Bên bán@_"
#    Then "_@Bên bán@_" should be visible in table line
#
#CH_06 Verify the "Mặt hàng" filter function when select "_@Tên mặt hàng@_"
#    [Tags]      Filter      Smoketest    BUG
#    Create a test data
#    Go to "Danh sách trạm cân " page
#    Click "Biểu đồ" tab button
#    When Click filter "Mặt hàng" with "_RANDOM_"
#    Then "_@Tên mặt hàng@_" should not be visible in table line
#    When Click filter "Mặt hàng" with "_@Tên mặt hàng@_"
#    Then "_@Tên mặt hàng@_" should be visible in table line
#
#### Verify the export excel report function ###
#CH_08 Verify the export excel report function
#    [Tags]        Download      Smoketest    BUG
#    Go to "Danh sách trạm cân " page
#    When Click select on frame "MIZA Đông Anh"
#    When Click "Xuất báo cáo Excel" button
#    When Click "Tổng hợp chung" menu
#    When Click on "Tất cả loại phiếu" droplist menu
#    # When Select file in "file name" with "Báo cáo cáo tổng hợp"
#    # When Click "Save" button
#    # Then The excel file should be downloaded
#
#### Verify the reload data function ###
#CH_13 Verify the reload data function
#    [Tags]        Reload      Smoketest    BUG
#    Go to "Danh sách trạm cân " page
#    When Click select on frame "MIZA Đông Anh"
#    When Click "Tải lại dữ liệu" button
#    Then The data should be reloaded

*** Keywords ***
Go to "${page}" page
    Login to admin
    Click "QUẢN LÝ" menu
    Click "Danh sách trạm cân" sub menu to "/station"

Go to page create data "${name}" with "${url}"
    When Login to admin
    When Click "QUẢN LÝ" menu
    When Click "${name}" sub menu to "${url}"
    When Click "Thêm mới" button

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
