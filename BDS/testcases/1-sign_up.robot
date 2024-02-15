*** Settings ***
Resource                ../keywords/common2.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
####Verify the User Interface of the Signup page
#SI_01. Verify the User Interface display correctly with design
#    [Tags]      Main page
#    When Click "Đăng ký" button
#    Then Heading should contain "Đăng ký tài khoản mới" inner text
#    And Webpage should contain "Số điện thoại" input field
#    And Webpage should contain "Mật khẩu" input field
#    And Webpage should contain "Xác nhận mật khẩu" input field
#    And Webpage should contain "Nhập họ và tên" input field
#    And Webpage should contain "Mã đăng ký" input field
#    And Webpage should contain "Liên hệ Zalo" button
#    And Webpage should contain "Đồng ý với Điều khoản và chính sách" check button
#    And Webpage should contain "Tiếp tục" button

#SI_02. Verify showing password when click on eye icon in "Mật khẩu" field
#    [Tags]      Main page
#    When Go to sign up page
#    And Enter "test name" in placeholder "Mật khẩu" with "_RANDOM_"
#    And Click on eye icon in "Mật khẩu" field
#    Then The hidden password in "Mật khẩu" field should be visibled as "_@Mật khẩu@_"

#SI_03. Verify showing password when click on eye icon in "Xác nhận mật khẩu" field
#    [Tags]      Main page
#    When Go to sign up page
#    And Enter "test name" in placeholder "Xác nhận mật khẩu" with "_RANDOM_"
#    And Click on eye icon in "Xác nhận mật khẩu" field
#    Then The hidden password in "Xác nhận mật khẩu" field should be visibled as "_@Xác nhận mật khẩu@_"

#SI_04. Verify clearing the field when click on cross icon in "Chọn loại tài khoản" field
#    [Tags]      Main page
#    When Go to sign up page
#    And Click select "Chọn loại tài khoản" with "Tài khoản bán"
#    And Click on cross icon in "Chọn loại tài khoản" field
#    Then "Chọn loại tài khoản" field should be empty
#    And Required message "Xin vui lòng nhập nội dung" displayed under in placeholder "Chọn loại tài khoản" field

####Verify signup successfully
SI_05. Verify that signup successfully when enter the valid data
    [Tags]      Signup
    When Go to sign up page
    And Enter "phone" in placeholder "Số điện thoại" with "_RANDOM_"
    And Enter "password" in placeholder "Mật khẩu" with "_RANDOM_"
    And Enter "password" in placeholder "Xác nhận mật khẩu" with "_@Mật khẩu@_"
    And Enter "name" in placeholder "Nhập họ và tên" with "_RANDOM_"
    And Click select "Chọn loại tài khoản" with "Tài khoản bán"
    And Enter "text" in placeholder "Mã đăng ký" with "BA123"
    And Click on "Đồng ý với Điều khoản và chính sách" check box
    And Click "Tiếp tục" button

*** Keywords ***
Go to sign up page
    When Click "Đăng ký" button

Enter "${type}" in placeholder "${placeholder}" with "${text}"
    Wait Until Element Spin
    ${text}=                    Get Random Text                   ${type}                       ${text}
    ${cnt}=	                    Get Element Count		              //input[@placeholder='${placeholder}']
    IF	${cnt} > 1 and '${placeholder}' == 'Số điện thoại'
      ${element}=               Set Variable                    //input[@placeholder='${placeholder}' and @id='phoneRegister']
    ELSE IF	${cnt} > 1 and '${placeholder}' == 'Mật khẩu'
      ${element}=               Set Variable                    //input[@placeholder='${placeholder}' and @id='password-register']
    ELSE
      ${element}=               Set Variable                    //input[@placeholder='${placeholder}']
    END
    Clear Text                 ${element}
    Fill Text                  ${element}                        ${text}
    ${cnt}=                    Get Length                        ${text}
    IF  ${cnt} > 0
      Set Global Variable      \${STATE["${placeholder}"]}       ${text}
    END

Click on eye icon in "${name}" field
    ${cnt}=	                    Get Element Count		              //input[@placeholder='${name}']
    IF	${cnt} > 1 and '${name}' == 'Mật khẩu'
      ${element}=               Set Variable                    //input[@placeholder='${name}' and @id='password-register']
    ELSE
      ${element}=               Set Variable                    //input[@placeholder='${name}']
    END
    Wait Until Element Is Existent                              ${element}
    Click                      ${element}/../i[contains(@class, "la-eye-slash")]

The hidden password in "${name}" field should be visibled as "${text}"
    ${text}=                  Check Text                         ${text}
    IF	'${name}' == 'Mật khẩu'
      ${element}=               Set Variable                    //input[@placeholder='${name}' and @id='password-register']
    ELSE
      ${element}=               Set Variable                    //input[@placeholder='${name}']
    END
    Get Property              ${element}                         type                       ==                             text
    Get Text                  ${element}                         equal                      ${text}

Click select "${name}" with "${text}"
    ${text}=                  Get Random Text                   Text                          ${text}
    ${element}=               Get Element                       //div[contains(@class,'choices__item choices__placeholder') and contains(text(),'${name}')]
    Wait Until Element Is Existent                              ${element}
    Click                     ${element}
    ${element}=               Get Element                       //*[contains(@class, "choices__input choices__input--cloned")]
    Fill Text                                                   ${element}                    ${text}
    Click                     xpath=//*[contains(@class, "choices__item--choice") and text()="${text}"]
    ${cnt}=                   Get Length                        ${text}
    IF  ${cnt} > 0
      Set Global Variable     \${STATE["${name}"]}              ${text}
    END

Click on cross icon in "${name}" field
    ${element}=               Set Variable                    //div[contains(@class, "choices__item choices__item--selectable")]
    Wait Until Element Is Existent                            ${element}
    ${element}=               Set Variable                    ${element}//button[contains(text(),'Remove item')]
    Click                     ${element}
    Click                     ${element}
    Click                     ${element}

"${name}" field should be empty
    ${element}=               Get Element                       //div[contains(@class,'choices__item choices__placeholder') and contains(text(),'${name}')]
    Get Text                  ${element}                         equal                      ${name}

Required message "${text}" displayed under in placeholder "${placeholder}" field
    ${element}=               Get Element Form Item By Placeholder        ${placeholder}    //*[contains(@class, "error")]
    Element Text Should Be    ${element}                        ${text}

Get Element Form Item By Placeholder
    [Arguments]               ${placeholder}                           ${xpath}=${EMPTY}
    IF	'${placeholder}' == 'Chọn loại tài khoản'
      ${element}=               Set Variable                    //*[contains(@class,'choices__input') and contains(@aria-label, '${placeholder}')]/../../..
    ELSE
      ${element}=               Set Variable                    //input[@placeholder='${placeholder}']/..
    END
    [Return]                  xpath=${element}${xpath}
