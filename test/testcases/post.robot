*** Settings ***
Resource            ../keywords/common.robot
Library             DateTime
Library             Telnet
Test Setup          Setup
Test Teardown       Tear Down


*** Test Cases ***
### Link to Test Cases    https://docs.google.com/spreadsheets/d/1cZhQbeh2IJzFWzTHMdGR0A_KvpYyA5WOEok3p9CgtIg/edit#gid=1976582717 ###

### Check the User Interface of the Post page ###
PO_01 Verify that navigating to the right "Post" page
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
   Login to admin
   When Click "QUẢN LÝ DANH MỤC" menu
   When Click "Post" sub menu to "/post"
   Then Webpage should contain the list data from database
   Then Webpage should contain the search function
   Then Webpage should contain "Tạo mới bài viết" button

PO_02 Verify the function changing the number of data show in each list
    [Tags]                                                                                        MainPage                                     UI                                          Smoketest
    Go to "Post" page
    When Click on "second" selection to change the number of data show in list and check
    When Click on "third" selection to change the number of data show in list and check
    When Click on "fourth" selection to change the number of data show in list and check
    When Click on "fifth" selection to change the number of data show in list and check

PO_03 Verify the function navigating to other lists of data page
    [Tags]                                                                                        MainPage                                    UI                                          Smoketest    BUG
    Go to "Post" page
    Then Check the amount of page list
         ${Last_name}=                                                                            Get data in the last row
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Move to the "next" page
         ${First_name}=                                                                           Get data in the first row
         Should Be Equal                                                                          ${First_name}                                ${Last_name}
    When Move to the "previous" page
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line
    Then Move to the last page and check

PO_04 Verify the highlight table line function after operated
    [Tags]                                                                                        MainPage                                  UI
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click "Đóng lại" button
    Then "_@Tiêu đề@_" table line should be highlighted
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

### Verify the correct design in detail information's Post page ###
PO_05 Verify that navigating to the right "Edit post" page
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Heading should contain "Cập nhật bài viết" inner Text
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_06 Check data information after creation
    [Tags]                                                                                        DetailedInfo                                 UI                                           Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Chi tiết" button in the "_@Tiêu đề@_" table line
    Then Data's information should contain "Loại editor" field
    Then Data's information should contain "Chuyên mục" field
    Then Data's information should contain "Tiêu đề" field
    When Click "Trở lại" button
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

### Verify the search function ###
PO_07 Verify the search function when enter the existed name
    [Tags]                                                                                        Search                                      Smoketest   BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Enter "test name" in "Tìm kiếm" with "_@Tiêu đề@_"
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_08 Verify the search function when enter the name was not existed
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Enter "text" in "Tìm kiếm" with "opp"
    When Click on magnifier icon in search box
    Then Table line should show empty
    When Enter "test name" in "Tìm kiếm" with "_@Tiêu đề@_"
    When Click on magnifier icon in search box
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_09 Check the update of data list after cancel the search action
    [Tags]                                                                                        Search                BUG
    Create a category with "Cate1" name
    ${name1}=                                                                                   Create a test data with "_@Tiêu đề@_" type
    Create a test data with "Cate1" type
    When Enter "text" in "Tìm kiếm" with "${name1}"
    When Click on magnifier icon in search box
    Then "${name1}" should be visible in table line
    Then "_@Tiêu đề@_" should not be visible in table line
    When Enter "text" in "Tìm kiếm" with ""
    When Click on magnifier icon in search box
    Then "${name1}" should be visible in table line
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "${name1}" table line
    When Click on the "Xóa" button in the "Cate1" item line

### Verify the creating data function ###
PO_10 Verify "Tạo mới bài viết" button function
    [Tags]                                                                                        Create                                       Smoketest
    Go to "Post" page
    When Click "Tạo mới bài viết" button
    Then Confirm adding "/post" page

PO_11 Create new data with the valid data
    [Tags]                                                                                        Create                                      Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    Then User look message "Thêm mới bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_12 Check the update of data list after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_13 Check the "Đăng bài" and "Hủy đăng" after creating a new data
    [Tags]                                                                                        Create                                       Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Đăng bài" button in the "_@Tiêu đề@_" table line
    Then User look message "Cập nhật thành công" popup
    When Click on the "Hủy đăng" button in the "_@Tiêu đề@_" table line
    Then User look message "Cập nhật thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_14 Check the cancel action button when publish data
    [Tags]                                                                                        Create                                      Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Đăng bài" button in the "_@Tiêu đề@_" table line with cancel
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

### Create new data with blank field ###
PO_15 Create a new data with all blank fields
    [Tags]                                                                                        Create                                       BlankField
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng chọn chuyên mục" displayed under "Chuyên mục" field
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

PO_16 Create a new data when leaving "Chuyên mục" field blank
    [Tags]                                                                                        Create                                       BlankField
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click "English" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Tiếng Việt" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng chọn chuyên mục" displayed under "Chuyên mục" field
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

PO_17 Create a new data when leaving "Tiêu đề" field blank
    [Tags]                                                                                        Create                                       BlankField
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click select "Chuyên mục" with "_@Tiêu đề@_"
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

PO_18 Create a new data when leaving "Tiêu đề" Tiếng Việt tab field blank
    [Tags]                                                                                        Create                                       BlankField
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click select "Chuyên mục" with "_@Tiêu đề@_"
    When Click "English" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Tiếng Việt" tab button
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

PO_19 Create a new data when leaving "Tiêu đề" English tab field blank
    [Tags]                                                                                        Create                                       BlankField
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click select "Chuyên mục" with "_@Tiêu đề@_"
    When Click "Tiếng Việt" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "English" tab button
    When Click "Lưu lại" button
    Then Required message "Xin vui lòng nhập tiêu đề" displayed under "Tiêu đề" field
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

### Create new data with invalid data ###
PO_20 Create a new data with the invalid "Tiêu đề"
    [Tags]                                                                                        Create                                      Invalid    BUG
    Create a category with "Cate1" name
    ${name1}=                                                                                   Create a test data with "_@Tiêu đề@_" type
    When Click "Tạo mới bài viết" button
    When Click select "Chuyên mục" with "Cate1"
    When Click "Tiếng Việt" tab button
    When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
    When Click "English" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Tiêu đề đã tồn tại" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "${name1}" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_21 Create a new data with the invalid "Tiêu đề" English tab field
    [Tags]                                                                                        Create                                      Invalid
    Create a category with "Cate1" name
    When Click "Tạo mới bài viết" button
    When Click select "Chuyên mục" with "Cate1"
    When Click "English" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Tiếng Việt" tab button
    When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
    When Click "Lưu lại" button
    Then User look message "Tiêu đề bản dịch bị trùng lặp" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "Cate1" item line

### Verify the funtion of changing account information ###
PO_22 Verify the changing "Loại editor" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click radio "Loại editor" in line "Block"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_23 Verify the changing "Chuyên mục" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a category with "Cate2" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click select "Chuyên mục" with "Cate1"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate2" item line
    When Click on the "Xóa" button in the "Cate1" item line

PO_24 Verify the changing "Tiêu đề" Tiếng Việt tab field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    Wait Until Element Spin
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_25 Verify the changing "Tiêu đề" English tab field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click "English" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Tiếng Việt" tab button
    When Enter "test name" in "Tiêu đề" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_26 Verify the changing "SEO URL" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "SEO URL" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_27 Verify the changing "Tác giả" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "Tác giả" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_28 Verify the changing "Mô tả ảnh cover" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "Mô tả ảnh cover" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_29 Verify the changing "Giới thiệu" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_30 Verify the changing "Tiêu đề SEO" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_31 Verify the changing "Từ khóa SEO" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "Từ khóa SEO" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_32 Verify the changing "Mô tả SEO" field
    [Tags]                                                                                        ChangeInfo   BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_33 Verify the changing "Ảnh cover" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Select file in "Ảnh cover" with "image.jpg"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_34 Verify the changing "Ảnh thumbnail" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Select file in "Ảnh thumbnail" with "image.jpg"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_35 Verify the changing "Longform" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click radio "Định dạng bài viết" in line "Longform"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_36 Verify the changing "Background Color" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "color" in "Background Color" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_37 Verify the changing "Title Fore Color" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "color" in "Title Fore Color" with "_RANDOM_"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_38 Verify the changing "Show Title" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click switch "Show Title" to be activated
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_39 Verify the changing "Ghim" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Click switch "Ghim" to be activated
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_40 Verify the changing "Custom Class" field
    [Tags]                                                                                        ChangeInfo
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in "Custom Class" with "text-blue-600"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_41 Verify the changing "Custom CSS" field
    [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    When Enter "text" in textarea "Custom CSS" with "{color:1px;}"
    When Click "Lưu lại" button
    Then User look message "Cập nhật bài viết thành công" popup
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_42 Verify the changing with the existed "Tiêu đề"
   [Tags]                                                                                        ChangeInfo    BUG
    Create a category with "Cate1" name
    ${name1}=                                                                                   Create a test data with "_@Tiêu đề@_" type
    ${name2}=                                                                                   Create a test data with "Cate1" type
    When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
    Wait Until Element Spin
    When Enter "test name" in "Tiêu đề" with "${name1}"
    When Click "Lưu lại" button
    Then User look message "Tiêu đề đã tồn tại" popup
    When Click "Đóng lại" button
    When Click on the "Xóa" button in the "${name1}" table line
    When Click on the "Xóa" button in the "${name2}" table line
    When Click on the "Xóa" button in the "Cate1" item line

### Verify the delete data function ###
PO_43 Verify the delete data function
    [Tags]                                                                                        Delete                                 Smoketest
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    Then "_@Tiêu đề@_" should not be visible in table line
    When Click on the "Xóa" button in the "Cate1" item line

PO_44 Verify the cancel action button when delete data
    [Tags]                                                                                        Delete
    Create a category with "Cate1" name
    Create a test data with "_@Tiêu đề@_" type
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line with cancel
    Then "_@Tiêu đề@_" should be visible in table line
    When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
    When Click on the "Xóa" button in the "Cate1" item line


*** Keywords ***
Go to "Post" page
  Login to admin
  Click "QUẢN LÝ DANH MỤC" menu
  Click "Post" sub menu to "/post"

Go to page create data "${name}" with "${url}"
  Login to admin
  Click "QUẢN LÝ DANH MỤC" menu
  Click "${name}" sub menu to "${url}"
  Click "Tạo mới bài viết" button

Create a category with "${name}" name
  ${condition}=              Run Keyword And Return Status            Confirm locating exactly in "Post" page
  IF    '${condition}' == 'True'
    Click "Tạo mới" button
  ELSE
    Go to "Post" page
    Click "Tạo mới" button
  END
  Enter "test name" in "Tiêu đề" with "${name}"
  Sleep    ${SHOULD_TIMEOUT}
  Enter "text" in textarea "Giới thiệu" with "_RANDOM_"
  Click "Lưu lại" button
  User look message "Thêm mới danh mục bài viết thành công" popup

Create a test data with "${type}" type
  Click "Tạo mới bài viết" button
  Click radio "Loại editor" in line "Block"
  Click select "Chuyên mục" with "${type}"
  Select file in "Ảnh cover" with "image.jpg"
  Select file in "Ảnh thumbnail" with "image.jpg"
  Click radio "Định dạng bài viết" in line "Longform"
  Enter "color" in "Background Color" with "_RANDOM_"
  Enter "color" in "Title Fore Color" with "_RANDOM_"
  Click switch "Show Title" to be activated
  Click switch "Ghim" to be activated
  Enter "text" in "Custom Class" with "text-blue-600"
  Enter "text" in textarea "Custom CSS" with "{color:1px;}"
  Click "English" tab button
  Enter "test name" in "Tiêu đề" with "_RANDOM_"
  Enter "text" in "Tác giả" with "_RANDOM_"
  Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
  Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
  Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
  Enter "text" in "Từ khóa SEO" with "_RANDOM_"
  Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
  Click "Tiếng Việt" tab button
  Enter "test name" in "Tiêu đề" with "_RANDOM_"
    ${text}=            Check Text            _@Tiêu đề@_
    ${name}=            Set Variable          ${text}
    [Return]            ${name}
  Enter "text" in "Tác giả" with "_RANDOM_"
  Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
  Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
  Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
  Enter "text" in "Từ khóa SEO" with "_RANDOM_"
  Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
  Click "Lưu lại" button
  User look message "Thêm mới bài viết thành công" popup
