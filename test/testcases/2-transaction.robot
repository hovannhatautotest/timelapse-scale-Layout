*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Test Setup          preconditions
Test Teardown       Tear Down

*** Test Cases ***
##Check the User Interface of the Transaction page
TS_01. Verify UI display correct with the design
    [Tags]      Transaction Page
    Then Heading should contain "Cổng 1" inner Text
    And Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    And Webpage should contain the list transaction from database
    And Webpage should contain the "Chọn loại phiếu" filter function
    And Webpage should contain the "Chọn khách hàng" filter function
    And Webpage should contain the "Chọn đối tác" filter function
    And Webpage should contain the "Chọn mặt hàng" filter function
    And Webpage should contain the "Ngày bắt đầu" filter function
    And Webpage should contain the "Ngày kết thúc" filter function
    And Webpage should contain the search function
    And Webpage should contain "Xuất báo cáo Excel" button
    And Webpage should contain "Tải lại dữ liệu" button
    And Webpage should contain "Tải mẫu upload phiếu" button
    And Webpage should contain "Upload phiếu" button

#TS_02. Verify UI display correct with design in window size of browser
#    [Tags]      Transaction Page
#    Then Having fully function like the fullsize browser
#    And Having the scroll bar if the content can not show out enough

TS_03. Verify the function navigate the list of transaction page
    [Tags]      Transaction Page
    When Move to the "next" page
    Then Webpage should contain the list transaction from database
    When Move to the "previous" page
    Then Webpage should contain the list transaction from database
    When Move to the last page and check
    Then Webpage should contain the list transaction from database

###TS_04. Verify the function changing the number of transaction show in each list
###    [Tags]      Transaction Page        Block
###    When Click on "second" selection to change the number of data show in list and check
###    Then Webpage should contain the list transaction from database
###    When Click on "third" selection to change the number of data show in list and check
###    Then Webpage should contain the list transaction from database
###    When Click on "fourth" selection to change the number of data show in list and check
###    Then Webpage should contain the list transaction from database

TS_05. Verify the detail information page correct with requirment
    [Tags]      DetailedInfo with UI
    When Click filter "Chọn loại phiếu" with "Phiếu nhập tay"
    And Click on the "Chi tiết" button in the "XA211123-5" table line
    Then Heading should contain "Chi tiết phiếu cân" inner Text

    And Heading should contain "Thông tin" title Text
    And Webpage should contain "Loại phiếu" field located in the "Thông tin" table
    And Webpage should contain "Mã phiếu" field located in the "Thông tin" table
    And Webpage should contain "Biển số" field located in the "Thông tin" table
    And Webpage should contain "Bên bán" field located in the "Thông tin" table
    And Webpage should contain "Bên mua" field located in the "Thông tin" table
    And Webpage should contain "Mặt hàng" field located in the "Thông tin" table
    And Webpage should contain "Đơn giá" field located in the "Thông tin" table
    And Webpage should contain "Thành tiền" field located in the "Thông tin" table
    And Webpage should contain "Ghi chú" field located in the "Thông tin" table
    And Webpage should contain "Trạm cân" field located in the "Thông tin" table
    And Webpage should contain "Số lần in" field located in the "Thông tin" table

    And Heading should contain "Số cân" title Text
    And Webpage should contain "KL1" field located in the "Số cân" table
    And Webpage should contain "KL2" field located in the "Số cân" table
    And Webpage should contain "KL Hàng" field located in the "Số cân" table
    And Webpage should contain "Tạp chất" field located in the "Số cân" table
    And Webpage should contain "Khối lượng thực" field located in the "Số cân" table

    And Heading should contain "Cân lần 1" title Text
    And Webpage should contain "Thời gian" field located in the "Cân lần 1" table
    And Webpage should contain "Vị trí" field located in the "Cân lần 1" table
    And Webpage should contain "Người cân" field located in the "Cân lần 1" table

    And Heading should contain "Cân lần 2" title Text
    And Webpage should contain "Thời gian" field located in the "Cân lần 2" table
    And Webpage should contain "Vị trí" field located in the "Cân lần 2" table
    And Webpage should contain "Người cân" field located in the "Cân lần 2" table

TS_08. Check the go back function when click on "left arrow" button
    [Tags]      DetailedInfo with UI
    When Click on the "Chi tiết" button in the "XA211123-5" table line
    And Click on the left arrow icon
    Then Heading should contain "Cổng 1" inner Text
    And Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    And Webpage should contain the list transaction from database
    And Webpage should contain the "Chọn loại phiếu" filter function
    And Webpage should contain the "Chọn khách hàng" filter function
    And Webpage should contain the "Chọn đối tác" filter function
    And Webpage should contain the "Chọn mặt hàng" filter function
    And Webpage should contain the "Ngày bắt đầu" filter function
    And Webpage should contain the "Ngày kết thúc" filter function
    And Webpage should contain the search function
    And Webpage should contain "Xuất báo cáo Excel" button
    And Webpage should contain "Tải lại dữ liệu" button
    And Webpage should contain "Tải mẫu upload phiếu" button
    And Webpage should contain "Upload phiếu" button
#
#####Verify the interact with image in detailed transaction
TS_09. Check to view images function "Ảnh chụp lần 1", "Ảnh chụp lần 2"
    [Tags]      DetailedInfo with Image
    When Search "Mã phiếu" in "Tìm kiếm" with "XA301123-8"
    And Click on the "Chi tiết" button in the "XA301123-8" table line
    And Click on the "Ảnh chụp lần 1" image
    Then Image should be enlarged
    When Click on cross button to close image
    And Click on the "Ảnh chụp lần 2" image
    Then Image should be enlarged
    When Click on cross button to close image

TS_10. Check to switch the images when viewing "Ảnh chụp lần 1", "Ảnh Chụp lần 2"
    [Tags]      DetailedInfo with Image
    When Search "Phiếu cân" in "Tìm kiếm" with "XA301123-8"
    And Click on the "Chi tiết" button in the "XA301123-8" table line
    And Click on the "Ảnh chụp lần 1" image
    And Move to the "Next" image
    Then Image should be enlarged
    When Move to the "Previous" image
    Then Image should be enlarged
    When Click on cross button to close image
    And Click on the "Ảnh chụp lần 2" image
    And Move to the "Next" image
    Then Image should be enlarged
    When Move to the "Previous" image
    Then Image should be enlarged
    When Click on cross button to close image

TS_11. Check to upload the images when upload "Ảnh chụp lần 1", "Ảnh Chụp lần 2"
    [Tags]      DetailedInfo with Image
    When Click on the "Chi tiết" button in the "DA231123-4" table line
    And Select file in "Ảnh chụp lần 1" with "lan1.png"
    Then User look message "Đã tải lên các file" popup
    When Select file in "Ảnh chụp lần 2" with "lan2.png"
    Then User look message "Đã tải lên các file" popup
    When Delete image in "Ảnh chụp lần 1"
    Then User look message "Xoá hình ảnh thành công" popup
    When Delete image in "Ảnh chụp lần 2"
    Then User look message "Xoá hình ảnh thành công" popup

####Verify search function
TS_13. Verify the search function when enter the existed name
    [Tags]      Search
    When Search "Mã phiếu" in "Tìm kiếm" with "NA131223-3"
    Then Webpage should contain the list transaction from database
    When Search "Bên bán" in "Tìm kiếm" with "CONG TY THUY TIEN"
    Then Webpage should contain the list transaction from database

TS_14. Verify the search functon when enter the name was not available
    [Tags]      Search
    When Search "test name" in "Tìm kiếm" with "_RANDOM_"
    Then Table line should show empty

##Verify the filter function
TS_15. Verify the date selection filter function
   [Tags]      Filter
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    When Enter date in placeholder "Ngày bắt đầu" with "2023-10-01"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    Then Webpage should contain the list transaction from database
    When Enter date in placeholder "Ngày bắt đầu" with "${today}"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    Then Table line should show empty

TS_16. Verify the "Khách hàng" filter function when select "_@Bên bán@_"
   [Tags]      Filter
    When Click filter "Chọn loại phiếu" with "Phiếu tự động"
    And Click filter "Chọn khách hàng" with "CONG TY THUY TIEN"
    And Webpage should contain the list transaction from database
    When Click filter "Chọn khách hàng" with "BEN MUA 1"
    Then Table line should show empty

TS_17. Verify the "Đối tác" filter function when select "_@Bên mua@_"
   [Tags]      Filter
    When Click filter "Chọn loại phiếu" with "Phiếu tự động"
    And Click filter "Chọn đối tác" with "CÔNG TY HTT"
    And Webpage should contain the list transaction from database
    When Click filter "Chọn đối tác" with "A1"
    Then Table line should show empty

TS_18. Verify the "Mặt hàng" filter function when select "_@Tên mặt hàng@_"
   [Tags]      Filter
    When Click filter "Chọn loại phiếu" with "Phiếu tự động"
    And Click filter "Chọn mặt hàng" with "GIẤY 2 MẶT NÂU"
    And Webpage should contain the list transaction from database
    When Click filter "Chọn mặt hàng" with "GIẤY CARTON"
    Then Table line should show empty

TS_19. Verify filter function by select multi condition at the same time
   [Tags]      Filter
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    When Click filter "Chọn loại phiếu" with "Phiếu tự động"
    When Click filter "Chọn khách hàng" with "CONG TY THUY TIEN"
    And Click filter "Chọn đối tác" with "Tất cả Đối tác"
    And Click filter "Chọn mặt hàng" with "GIẤY 2 MẶT NÂU"
    And Enter date in placeholder "Ngày bắt đầu" with "2023-10-01"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    And Webpage should contain the list transaction from database

TS_20. Verify the "Loại phiếu" filter function when select "Phiếu nhập tay"
   [Tags]      Filter
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    When Enter date in placeholder "Ngày bắt đầu" with "${today}"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"
    And Click filter "Chọn loại phiếu" with "Phiếu tự động"
    Then Table line should show empty
    When Click filter "Chọn loại phiếu" with "Phiếu nhập tay"
    Then Webpage should contain the list transaction from database

TS_21. Verify the "Loại phiếu" filter function when select "Phiếu tự động"
   [Tags]      Filter
    When Enter date in placeholder "Ngày bắt đầu" with "2023-12-14"
    And Enter date in placeholder "Ngày kết thúc" with "2023-12-14"
    And Click filter "Chọn loại phiếu" with "Phiếu nhập tay"
    Then Table line should show empty
    When Click filter "Chọn loại phiếu" with "Phiếu tự động"
    Then Webpage should contain the list transaction from database

####Verify the Upload excel function
TS_28. Verify the Upload excel function
   [Tags]      Upload excel
    When Select file in "Upload phiếu" with "phieucan.xlsx"
    Then User look message "Đã lưu 1 phiếu hợp lệ" popup
    And Webpage should contain the list transaction from database
    When Delete the newly created transaction
    Then User look message "Xóa dữ liệu nhập tay thành công" popup

*** Keywords ***
preconditions
    Setup
    Go to "Danh sách trạm cân" page
    When Click select on frame "Cổng 1"
    And Click "Phiếu cân" tab button
    ${today}=         Get Current Date      local     result_format=%Y-%m-%d
    And Enter date in placeholder "Ngày bắt đầu" with "2023-10-01"
    And Enter date in placeholder "Ngày kết thúc" with "${today}"

Delete the newly created transaction
    ${element}=             Get Elements         //button[@title = "Chi tiết"]/../i
    wait until element is existent              ${element}[0]
    click                                       ${element}[0]
    Click Confirm To Action

Go to "${page}" page
  Login to admin
  When Click "QUẢN LÝ" menu
  And Click "Danh sách trạm cân" sub menu to "/station"

Webpage should contain the list transaction from database
  Log To Console    .
  Log To Console    *************************-List Of Weighing Transactions-**************************
  ${elements}=               Get Elements                       //tbody/*[contains(@class,'ant-table-row')]
  wait until element is visible         ${elements}[0]          ${BROWSER_TIMEOUT}
  ${count}=                   Set Variable        2
  ${NO}=                      Set Variable        1
  FOR  ${i}  IN  @{elements}
       ${form_code}=        Get Text      //tbody/tr[${count}]/td[2]
       ${date_created}=     Get Text      //tbody/tr[${count}]/td[3]
       ${seller}=           Get Text      //tbody/tr[${count}]/td[4]
       ${buyer}=            Get Text      //tbody/tr[${count}]/td[5]
       ${weigh_1}=          Get Text      //tbody/tr[${count}]/td[6]
       ${KL_1}=             Get Text      //tbody/tr[${count}]/td[7]
       ${weigh_2}=          Get Text      //tbody/tr[${count}]/td[8]
       ${KL_2}=             Get Text      //tbody/tr[${count}]/td[9]
       ${KL}=               Get Text      //tbody/tr[${count}]/td[10]
       ${Note}=             Get Text      //tbody/tr[${count}]/td[11]
       Log To Console       Weighing Transaction Number ${NO}
       Log To Console       Mã phiếu: ${form_code} || Ngày tạo: ${date_created}
       Log To Console       Bên bán: ${seller} || Bên mua: ${buyer}
       Log To Console       Cân lần 1: ${weigh_1} || Khối lượng lần 1: ${KL_1}
       Log To Console       Cân lần 2: ${weigh_2} || Khối lượng lần 2: ${KL_2}
       Log To Console       Khối lượng hàng: ${KL} || Note: ${Note}
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
      ${element}=               Get Element                   //nz-select[contains(@ng-reflect-nz-place-holder, "${name}")]/..//*[contains(@class, "ant-select-show-arrow")]
  END
  ${count}=                    Get Element Count                 ${element}
  Should Be True               ${count} >= 1

Click filter "${name}" with "${text}"
  ${text}=                  Get Random Text                   Text                          ${text}
  ${element}=               Get Element                       //nz-select[contains(@ng-reflect-nz-place-holder, "${name}")]/..//*[contains(@class, "ant-select-show-arrow")]
  wait until element is existent                              ${element}
  click                     ${element}
  ${element}=               Get Element                       //nz-select[contains(@ng-reflect-nz-place-holder, "${name}")]/..//*[contains(@class, "ant-select-selection-search-input")]
  wait until element is existent                              ${element}
  Fill Text                                                   ${element}                   ${text}        True
  Click                     xpath=//*[contains(@class, "ant-select-item-option") and @title="${text}"]
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Having the "left arrow" button to go back to the "Danh sách trạm cân" page
    ${element}=               Get Element                      //i[contains(@class,'la-arrow-left')]
    ${count}=                 Get Element Count                  ${element}
    Should Be True            ${count} > 0

Image should be enlarged
    Wait Until Image Visible

Click on the "${name}" image
  ${elementS}=	              Get Elements 			                 //*[contains(text(),'${name}')]//following-sibling::div//img
  Click	                    ${elementS}[0]
  Wait Until Image Visible

Click on "${name}" menu
    ${element}=               Get Element         //*[contains(text(),'${name}')]
    wait until element is existent                ${element}
    click                                         ${element}

Click on "${name}" sub menu
    ${element}=               Get Element         //*[contains(text(),'${name}')]
    wait until element is existent                ${element}
    click                                         ${element}

Select file in "${name}" with "${image_name}"
  ${element}=               Get Elements                       //input[@type = "file"]
  Upload File By Selector   ${element}[0]                      test/upload/${image_name}
  Wait Until Image Is Uploaded

Delete image in "${name}"
  ${elements}=      Get Elements      //button[@title = "Remove file"]
  Wait Until Element Is Existent        ${elements}[0]
  Click	                    ${elements}[0]
  Click Confirm To Action

Search "${type}" in "Tìm kiếm" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element                       //*[contains(@placeholder, "Nhập để tìm kiếm...")]
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}                       True
  ${condition}=             Get Text                          ${element}
  WHILE    '${condition}' != '${text}'    limit=10
    Fill Text               ${element}                        ${text}
    ${condition}=           Get Text                          ${element}
  END
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${text}"]}              ${text}
  END
  press keys                 ${element}                       Enter
