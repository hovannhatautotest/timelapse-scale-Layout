*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
### Link to Testcases: https://docs.google.com/spreadsheets/d/1DbP64bT7QpASuE3NeiIVDdeHpdrKQon3HqF9rsUzbFU/edit#gid=1999164743 ###

### Verify the User Interface of the Login Page ###
### Verify that login with leaving a blank field ###
LO_01. Verify that log in with leaving the blank field in "Email"
  [Tags]    Login     BlankField      Smoketest
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  And Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập email" displayed under "Email" field

LO_02. Verify that log in with leaving the blank field in "Mật khẩu"
  [Tags]    Login     BlankField      Smoketest
  When Enter "email" in "Email" with "_RANDOM_"
  And Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập mật khẩu" displayed under "Mật khẩu" field

LO_03. Verify that log in with leaving the blank field in "Email" and "Mật khẩu"
  [Tags]    Login     BlankField      Smoketest
  When Click "Đăng nhập" button
  Then Required message "Xin vui lòng nhập email" displayed under "Email" field
  And Required message "Xin vui lòng nhập mật khẩu" displayed under "Mật khẩu" field

LO_04. Verify showing password when click on eye icon in "Mật khẩu" field
  [Tags]    MainPage    UI
  When Enter "password" in "Mật khẩu" with "_RANDOM_"
  And Click on eye icon in "Mật khẩu" field
  Then The hidden password in "Mật khẩu" field should be visibled as "_@Mật khẩu@_"

### Verify the login when enter the invalid data ###
LO_05. Verify that login with entering the invalid data in "Email" field
  [Tags]    Login     Invalid       Smoketest     BUG
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "password" in "Mật khẩu" with "123456"
  When Click "Đăng nhập" button
  Then User look message "Tài khoản _@Email@_ không tồn tại trong hệ thống. Vui lòng đăng ký mới." popup
  #Thực tế: User look message "Tài khoản hoặc mật khẩu không đúng" popup

LO_06. Verify that login successfully when enter the valid data (admin account)
  [Tags]    Login     Valid     Smoketest
  When Enter "email" in "Email" with "mizaatl"
  When Enter "password" in "Mật khẩu" with "123456"
  When Click "Đăng nhập" button
  Then User look message "Success" popup

### Verify the remember account function ###
LO_07. Verify the remember account function when click on "Ghi nhớ" check field
  [Tags]    Login     Remember
  When Enter "email" in "Email" with "mizaatl"
  When Enter "password" in "Mật khẩu" with "123456"
  When Click on "Ghi nhớ" check box
  When Click "Đăng nhập" button
  Then User look message "Success" popup
  When Log out account

*** Keywords ***
User look text in "${name}" with "${text}"
  ${text}=              Check Text                         ${text}
  ${element}=           Get Element Form Item By Name      ${name}          //input
  Get Text              ${element}                         equal            ${text}
