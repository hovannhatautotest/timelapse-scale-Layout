*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          preconditions
Test Teardown       Tear Down

*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1YBH5Dm-BQnMuFWWwyUBjf36T8-VKYULP_kF8MzaK7Gc/edit#gid=2094605949 ###

### Check the User Interface of the Chart page  ###
#CH_01 Verify UI display correct with the design
#    [Tags]      MainPage      UI     Smoketest
#    Then Heading should contain "Cổng 1" inner Text
#    And Having the "left arrow" button to go back to the "Danh sách trạm cân" page
#    And Webpage should contain the "Chọn khách hàng" filter function
#    And Webpage should contain the "Chọn đối tác" filter function
#    And Webpage should contain the "Chọn mặt hàng" filter function
#    And Webpage should contain the "Ngày bắt đầu" filter function
#    And Webpage should contain the "Ngày kết thúc" filter function
#    And Webpage should contain "Xuất báo cáo Excel" button
#    And Webpage should contain "Tải lại dữ liệu" button
#    And Webpage should contain the chart of "KL nhập xuất" field
#    And Webpage should contain the chart of "Số xe nhập xuất" field
#    And Webpage should contain the chart of "KL Tạp chất" field
#    And Webpage should contain the chart of "Tỉ lệ Tạp chất" field
#    And Webpage should contain the chart of "Tỉ lệ Tạp chất/ KL nhập (%)" field

#####CH_02. Verify UI display correct with design in window size of browser
#####    [Tags]      MainPage      UI     Smoketest
#####    Then Having fully function like the fullsize browser
#####    Then Having the scroll bar if the content can not show out enough

### Verify the filter function ###
CH_04 Verify the "Khách hàng" filter function when select "_@Bên mua@_"
    [Tags]      Filter      Smoketest    BUG
    Create a test data
    Go to "Danh sách trạm cân " page
    Click "Biểu đồ" tab button
    When Click filter "Khách hàng" with "_RANDOM_"
    Then "_@Bên mua@_" should not be visible in table line
    When Click filter "Khách hàng" with "_@Bên mua@_"
    Then "_@Bên mua@_" should be visible in table line
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
preconditions
    Setup
    Go to "Danh sách trạm cân" page
    When Click select on frame "Cổng 1"
    And Click "Biểu đồ" tab button
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    And Enter date in placeholder "Ngày bắt đầu" with "2023-01-01"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"

Go to "${page}" page
    Login to admin
    When Click "QUẢN LÝ" menu
    And Click "Danh sách trạm cân" sub menu to "/station"

Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    ${element}=               Get Element                      //i[contains(@class,'la-arrow-left')]
    ${count}=                 Get Element Count                  ${element}
    Should Be True            ${count} > 0

Webpage should contain the "${name}" filter function
    IF    '${name}' == 'Ngày bắt đầu' or '${name}' == 'Ngày kết thúc'
        ${element}=               Get Element                   //input[contains(@placeholder, "${name}")]
    ELSE
        ${element}=               Get Element                   //*[contains(@ng-reflect-nz-place-holder,'${name}')]
    END
    ${count}=                    Get Element Count                 ${element}
    Should Be True               ${count} >= 1

Webpage should contain the chart of "${text}" field
    ${element}=               Get Elements                      //*[contains(text(),'${text}')]
    ${count}=                 Get Element Count                  ${element}[0]
    Should Be True            ${count} > 0
