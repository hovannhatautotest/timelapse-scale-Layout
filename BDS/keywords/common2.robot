*** Settings ***
Library             Browser
Library             FakerLibrary        locale=en_IN
Library             String
Library             BuiltIn

*** Variables ***
${BROWSER}          chromium
${HEADLESS}         ${False}
${BROWSER_TIMEOUT}  60 seconds
${SHOULD_TIMEOUT}   0.1 seconds
${TIME_TRY}         0.5 seconds

${URL_DEFAULT}      http://dev1.geneat.vn:7105/

#${URL_DEFAULT}      http://localhost:4200/#/vn

${STATE}            Evaluate    json.loads('''{}''')  json

*** Keywords ***

#### Setup e Teardown
Setup
  Set Browser Timeout         ${BROWSER_TIMEOUT}
  New Browser                 ${BROWSER}  headless=${HEADLESS}
  New Page                    ${URL_DEFAULT}
  ${STATE}                    Evaluate  json.loads('''{}''')  json

Tear Down
  Close Browser               ALL

###  -----  Form & Fill  -----  ###
Check Text
  [Arguments]               ${text}
  ${containsS}=             Get Regexp Matches                ${text}                      _@(.+)@_                   1
  ${cntS}=                  Get length                        ${containsS}
  IF  ${cntS} > 0
    ${text}=                Set Variable                      ${STATE["${containsS[0]}"]}
  END
  [Return]    ${text}

Get Random Text
  [Arguments]               ${type}                           ${text}
  ${symbol}                 Set Variable                      _RANDOM_
  ${new_text}               Set Variable
  ${containsS}=             Get Regexp Matches                ${text}                       _@(.+)@_                   1
  ${cntS}=                  Get length                        ${containsS}
  ${contains}=              Get Regexp Matches                ${text}                       ${symbol}
  ${cnt}=                   Get length                        ${contains}
  IF  ${cntS} > 0
    ${new_text}=            Set Variable                      ${STATE["${containsS[0]}"]}
    ${symbol}=              Set Variable                      _@${containsS[0]}@_
  ELSE IF  ${cnt} > 0 and '${type}' == 'test name'
    ${random}=              FakerLibrary.Sentence             nb_words=3
    ${words}=               Split String                      ${TEST NAME}                  ${SPACE}
    ${new_text}=            Set Variable                      ${words[0]} ${random}
  ELSE IF  ${cnt} > 0 and '${type}' == 'number'
    ${new_text}=            FakerLibrary.Random Int
    ${new_text}=            Convert To String                 ${new_text}
  ELSE IF  ${cnt} > 0 and '${type}' == 'percentage'
    ${new_text}=            FakerLibrary.Random Int           max=100
    ${new_text}=            Convert To String                 ${new_text}
  ELSE IF  ${cnt} > 0 and '${type}' == 'paragraph'
    ${new_text}=            FakerLibrary.Paragraph
  ELSE IF  ${cnt} > 0 and '${type}' == 'email'
    ${new_text}=            FakerLibrary.Email
  ELSE IF  ${cnt} > 0 and '${type}' == 'phone'
    ${new_text}=            FakerLibrary.Random Int           min=20000000                  max=99999999
    ${new_text}=            Convert To String                 ${new_text}
    ${List}=                Create List                       3    7    8    9
    ${2nd_number}=          Evaluate                          random.choice($List)          random
    ${2nd_number}=          Convert To String                 ${2nd_number}
    ${new_text}=            Catenate                          SEPARATOR=                    0                           ${2nd_number}                 ${new_text}
  ELSE IF  ${cnt} > 0 and '${type}' == 'color'
    ${new_text}=            FakerLibrary.Safe Hex Color
  ELSE IF  ${cnt} > 0 and "${type}" == 'password'
    ${new_text}=            FakerLibrary.Password            10                             True                        True                          True                        True
  ELSE IF  ${cnt} > 0 and '${type}' == 'date'
    ${new_text}=            FakerLibrary.Date  	              pattern=%d-%m-%Y
  ELSE IF  ${cnt} > 0 and '${type}' == 'word'
    ${new_text}=            FakerLibrary.Sentence             nb_words=2
  ELSE IF  ${cnt} > 0 and '${type}' == 'title'
    ${word_1}=              FakerLibrary.Text                 max_nb_chars=15
    ${word_2}=              FakerLibrary.Text                 max_nb_chars=15
    ${word_3}=              FakerLibrary.Text                 max_nb_chars=15
    ${word_4}=              FakerLibrary.Text                 max_nb_chars=15
    ${word_5}=              FakerLibrary.Text                 max_nb_chars=15
    ${words}=               Split String                      ${TEST NAME}                  ${SPACE}
    ${new_text}=            Catenate                          ${words[0]}                   ${word_1}                   ${word_2}                     ${word_3}                   ${word_4}                   ${word_5}
  ELSE IF  ${cnt} > 0
    ${new_text}=            FakerLibrary.Sentence
  END
    ${cnt}=                 Get Length                        ${text}
  IF  ${cnt} > 0
    ${text}=                Replace String                    ${text}                       ${symbol}                   ${new_text}
  END
  [Return]    ${text}

Enter "${type}" in "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-input")]
  Click                     ${element}
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
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Enter "${type}" in "${name}" of "${tab}" tab with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element                       //*[contains(@class, "ant-tabs-tab-btn") and contains(text(), "${tab}")]//ancestor::*[contains(@class,'ant-tabs-default')]//label[text()="${name}"]/../..//*[contains(@class, "ant-input")]
  Click                     ${element}
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
    Set Global Variable     \${STATE["${name}_${tab}"]}       ${text}
  END

Enter "${type}" in textarea "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //textarea
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}
  ${condition}=             Get Text                          ${element}
  WHILE    '${condition}' != '${text}'    limit=10
    Fill Text               ${element}                        ${text}
    ${condition}=           Get Text                          ${element}
  END
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
  Set Global Variable       \${STATE["${name}"]}              ${text}
  END

Enter date in "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   date                          ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-picker-input")]/input
  Click                     ${element}
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}
  ${condition}=             Get Text                          ${element}
  WHILE    '${condition}' != '${text}'    limit=10
    Fill Text               ${element}                        ${text}
    ${condition}=           Get Text                          ${element}
  END
  Press Keys                ${element}                        Tab
  Press Keys                ${element}                        Tab
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
      Set Global Variable   ${STATE["${name}"]}               ${text}
  END

Enter "${type}" in placeholder "${placeholder}" with "${text}"
  Wait Until Element Spin
  ${text}=                   Get Random Text                   ${type}                       ${text}
  ${element}=                Get Element                       //input[contains(@placeholder, "${placeholder}")]
  Clear Text                 ${element}
  Fill Text                  ${element}                        ${text}
  ${cnt}=                    Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable      \${STATE["${placeholder}"]}       ${text}
  END

Enter "${type}" in login placeholder "${placeholder}" with "${text}"
  Wait Until Element Spin
  ${text}=                   Get Random Text                   ${type}                       ${text}
  ${element}=                Get Element                       //input[contains(@id,'login') and @placeholder = '${placeholder}']
  Clear Text                 ${element}
  Fill Text                  ${element}                        ${text}
  ${cnt}=                    Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable      \${STATE["${placeholder}"]}       ${text}
  END

Enter date in placeholder "${name}" with "${date}"
  Wait Until Element Spin
  ${element}=                 Get Element                      //input[contains(@placeholder, "${name}")]
  Clear Text                  ${element}
  ${date}=                    Convert To String                ${date}
  Fill Text                   ${element}                       ${date}                      True
  Keyboard Key                Press                            Tab
  ${cnt}=                     Get Length                       ${date}
  IF  ${cnt} > 0
    Set Global Variable       \${STATE["${name}"]}             ${name}
  END

Enter "${type}" in editor "${name}" with "${text}"
  Wait Until Element Spin
  ${text}=                  Get Random Text                   ${type}                       ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class,'ce-paragraph')]
  Click                     ${element}
  Clear Text                ${element}
  Fill Text                 ${element}                        ${text}                       True
  ${elementS}=              Get Element Form Item By Name     ${name}                       //*[contains(@class,'ce-paragraph') and contains(text(),'${text}')]
  Wait Until Element Is Existent                              ${elementS}
  Sleep                     ${TIME_TRY}
  ${condition}=             Get Text                          ${element}
  WHILE    '${condition}' != '${text}'    limit=10
    Fill Text               ${element}                        ${text}
    ${condition}=           Get Text                          ${element}
  END
  Scroll To Element         ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Clear data in "${name}" field
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-input")]
  Click                     ${element}
  Clear Text                ${element}

###  -----  Table  -----  ###
Get Element Table Item By Name
  [Arguments]               ${name}                           ${xpath}
  [Return]                  xpath=//*[contains(@class, "ant-table-row")]//*[contains(text(),"${name}")]/ancestor::tr${xpath}

"${name}" should be visible in table line
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //tbody//tr[contains(@class,'ant-table-row')]/td/*[contains(text(),"${name}")]
  Wait Until Element Is Existent                               ${element}

"${name}" should not be visible in table line
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //tbody//tr[contains(@class,'ant-table-row')]/td/*[contains(text(),"${name}")]
  Wait Until Page Does Not Contain Element                     ${element}

Table line should show empty
  Wait Until Element Is Existent                               //p[contains(@class, 'ant-empty-description')]
  Get Property              //p[contains(@class, 'ant-empty-description')]                innerText                equal            No Data

"${name}" table line should be highlighted
  ${name}=                  Check Text                         ${name}
  Wait Until Element Is Existent                               //button[contains(text(),"${name}")]//ancestor::tr
  Get Property              //button[contains(text(),"${name}")]//ancestor::tr            className                contains         bg-blue-100

"${name}" should be visible in the first table line
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  Get Text                  //tbody/tr[2]/td[2]/*              equal                      ${name}

"${name}" should be visible in the first table line
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  Get Text                  //tbody/tr[2]/td[2]/*              inequal                    ${name}

"${name}" table line should contain the "${button}" button
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]//ancestor::tr//button[@title="${button}"]
  Wait Until Element Is Existent                               ${element}

Click on the "${text}" button in the "${name}" table line
  Sleep                      ${SHOULD_TIMEOUT}
  Wait Until Element Spin
  ${name}=                   Check Text                        ${name}
  IF    '${text}' == 'Chi tiết'
    ${element1}=             Get Element Table Item By Name    ${name}                     //button[@title = "${text}"]
    ${count}=                Get Element Count                 ${element1}
    IF    ${count} > 0
      Click                  ${element1}
    ELSE
      ${elementS}=           Get Element Table Item By Name    ${name}                     //p[contains(text(),"${name}")]
      Click                  ${elementS}
    END
  ELSE
    ${element}=              Get Element Table Item By Name    ${name}                     //button[@title = "${text}"]
    Sleep                    ${SHOULD_TIMEOUT}
    Click                    ${element}
  END
  Click Confirm To Action

Click on the "${text}" button in the "${name}" table line with cancel
  Sleep                     ${SHOULD_TIMEOUT}
  Wait Until Element Spin
  ${name}=                  Check Text                         ${name}
  ${element}=               Get Element Table Item By Name     ${name}                     //button[@title = "${text}"]
  Wait Until Element Is Existent                               ${element}
  Sleep                     ${SHOULD_TIMEOUT}
  Click                     ${element}
  Click Cancel Action

###  -----  Item  -----  ###
Get Element Item By Name
  [Arguments]               ${name}                           ${xpath}=${EMPTY}
  [Return]                  xpath=//*[contains(@class, "item-text") and contains(text(), "${name}")]/ancestor::*[contains(@class, "item")]${xpath}

Click on the "${text}" button in the "${name}" item line
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Item By Name          ${name}                      //button[@title = "${text}"]
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}
  Click Confirm To Action

Click on the "${text}" button in the "${name}" item line with cancel
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Item By Name          ${name}                      //button[@title = "${text}"]
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}
  Click Cancel Action

Select on the "${text}" item line
  ${text}=                  Check Text                        ${text}
  ${element}=               Get Element Item By Name          ${text}
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}

"${name}" should be visible in item line
  ${name}=                  Check Text                         ${name}
  Wait Until Element Is Existent                               //*[contains(@class,'ant-spin-container')]//span[contains(text(),'${name}')]

"${name}" should not be visible in item line
  ${name}=                  Check Text                         ${name}
  Wait Until Page Does Not Contain Element                     //*[contains(@class,'ant-spin-container')]//span[contains(text(),'${name}')]

"${name}" item line should be highlighted
  ${name}=                  Check Text                         ${name}
  ${element}                Get Element Item By Name           ${name}
  Wait Until Element Is Existent                               ${element}
  Get Property              ${element}                         className                  contains                       bg-blue-100

###  -----  Tree  -----  ###
Get Element Tree By Name
  [Arguments]               ${name}                           ${xpath}=${EMPTY}
  [Return]                  xpath=//*[contains(@class, "ant-tree-node-content-wrapper") and @title = "${name}"]/*[contains(@class, "group")]${xpath}

Click on the "${name}" tree to delete
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Tree By Name          ${name}
  Wait Until Element Is Existent                              ${element}
  Scroll To Element         ${element}
  Mouse Move Relative To    ${element}                        0
  Click                     ${element}//*[contains(@class, "la-trash")]
  Click Confirm To Action

Click on the "${name}" tree to delete with cancel
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Tree By Name          ${name}
  Wait Until Element Is Existent                              ${element}
  Scroll To Element         ${element}
  Mouse Move Relative To    ${element}                        0
  Click                     ${element}//*[contains(@class, "la-trash")]
  Click Cancel Action

Click on the "${name}" tree to edit
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element Tree By Name          ${name}
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}

"${name}" should be visible in the tree line
  ${name}=                  Check Text                         ${name}
  Wait Until Element Is Existent                               //nz-tree-node-title[@title="${name}" and contains(@class,"ant-tree-node-content-wrapper")]

"${name}" should not be visible in the tree line
  ${name}=                  Check Text                         ${name}
  Wait Until Page Does Not Contain Element                     //nz-tree-node-title[@title="${name}" and contains(@class,"ant-tree-node-content-wrapper")]

Click tree select "${name}" with "${text}"
  ${text}=                  Get Random Text                   Text                          ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-tree-select")]
  Click                     ${element}
  Fill Text                 ${element}//input                 ${text}
  Click                     xpath=//*[contains(@class, "ant-select-tree-node-content-wrapper") and @title="${text}"]
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Click tree select "${name}" to show data
  ${name}=                  Check Text                        ${name}
  ${element}=               Get Element                       //nz-tree-node-title[@title="${name}"]/..//i[contains(@class,'la-angle-down')]
  Click                     ${element}
  Wait Until Element Spin

###  -----  Element  -----  ###
Element Should Be Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${SHOULD_TIMEOUT}
  Wait For Elements State   ${locator}  visible               ${timeout}                    ${message}

Element Should Not Be Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${SHOULD_TIMEOUT}
  Wait For Elements State   ${locator}  hidden                ${timeout}                    ${message}

Element Should Be Exist
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${TIME_TRY}
  Wait For Elements State   ${locator}  attached              ${timeout}                    ${message}

Element Text Should Be
  [Arguments]               ${locator}  ${expected}           ${message}=${EMPTY}           ${ignore_case}=${EMPTY}
  Get Text                  ${locator}  equal                 ${expected}                   ${message}

Get Element Form Item By Name
  [Arguments]               ${name}                           ${xpath}=${EMPTY}
  [Return]                  xpath=//*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]/../../*[contains(@class, "ant-form-item")]${xpath}

Click "${text}" button
  Sleep                     ${SHOULD_TIMEOUT}
  ${cnt}=	                  Get Element Count		              //button[@title = "${text}"]
  IF	${cnt} > 0
    Click                     xpath=//button[@title = "${text}"]
    Click Confirm To Action
  Scroll By                 ${None}
  ELSE
    Click 	                  //span[contains(text(),"${text}")]
    Click Confirm To Action
    Scroll By                 ${None}
  END

Click "${text}" tab button
  Click                     xpath=//*[contains(@class, "ant-tabs-tab-btn") and contains(text(), "${text}")]
  Wait Until Element Spin

Click "${text}" menu
  Wait Until Element Is Existent                              //li[contains(@class, "menu") and descendant::span[contains(text(), "${text}")]]
  Click                     xpath=//li[contains(@class, "menu") and descendant::span[contains(text(), "${text}")]]

Click on "${text}" droplist menu
  ${element}=               Set Variable                      //li[contains(@class, "menu") and contains(text(), "${text}")]
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}

Click "${text}" sub menu to "${url}"
  Wait Until Element Is Existent                              //a[contains(@class, "sub-menu") and descendant::span[contains(text(), "${text}")]]
  Click                     xpath=//a[contains(@class, "sub-menu") and descendant::span[contains(text(), "${text}")]]
  ${curent_url}=            Get Url
  Should Contain            ${curent_url}                     ${URL_DEFAULT}${url}

Click select on frame "${name}"
  ${element}=               Set Variable                      //*[contains(@class, "shadow-md") and descendant::*[contains(text(), "${name}")]]
  Click                     ${element}

Click on "${name}" check box
  ${name}=                  Get Substring                      ${name}        0       10
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]/..//*[contains(@class,'cursor-pointer')]
  Click                     ${element}

Click select "${name}" with "${text}"
  ${text}=                  Get Random Text                   Text                          ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-select-show-arrow")]
  Wait Until Element Is Existent                              ${element}
  Click                     ${element}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-select-selection-search-input")]
  Fill Text                                                   ${element}                    ${text}
  Click                     xpath=//*[contains(@class, "ant-select-item-option") and @title="${text}"]
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Click radio select "${name}" with "${text}"
  ${text}=                  Get Random Text                   Text                          ${text}
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-radio-button-wrapper")]/span[contains(text(), "${text}")]
  Click                     ${element}
  ${cnt}=                   Get Length                        ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}              ${text}
  END

Log out account
  Click                      //img[contains(@alt,'Avatar')]
  Wait Until Element Spin
  Click                      //li[contains(text(),'Đăng xuất')]

Click on magnifier icon in search box
  Sleep                      ${SHOULD_TIMEOUT}
  Click                      xpath=//*[contains(@class, "las la-search")]
  Wait Until Element Spin

Click on eye icon in "${name}" field
  ${element}=                Get Element                      //*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]/../../*[contains(@class, "ant-form-item")]//input//ancestor::div[contains(@class, 'relative ng-star-inserted')]
  Wait Until Element Is Existent                              ${element}
  Click                      ${element}/i[contains(@class, "la-eye-slash")]

Click on the left arrow icon
  ${element}=                Get Element                      //i[contains(@class,'la-arrow-left')]
  Wait Until Element Is Existent                              ${element}
  Click                      ${element}

Click Confirm To Action
  Sleep                     ${SHOULD_TIMEOUT}
  ${element}                Set Variable                      xpath=//*[contains(@class, "ant-popover")]//*[contains(@class, "ant-btn-primary")]
  ${count}=                 Get Element Count                 ${element}
  IF    ${count} > 0
    Click                   ${element}
    Sleep                   ${SHOULD_TIMEOUT}
    Wait Until Element Spin
  END

Click Cancel Action
  ${element}                Set Variable                       //*[contains(@class, "ant-popover")]//button[1]
  ${count}=                 Get Element Count                  ${element}
  IF    ${count} > 0
    Click                   ${element}
    Sleep                   ${SHOULD_TIMEOUT}
  END

Click "${text}" button with cancel action
  Click                     //button[@title = "${text}"]
  Click Cancel Action
  Scroll By                 ${None}

Select file in "${name}" with "${image_name}"
  ${element}=               Get Element Form Item By Name     ${name}                       //input[@type = "file"]
  Upload File By Selector   ${element}                        Auto_Web/upload/${image_name}
  Wait Until Image Is Uploaded

Click radio "${name}" in line "${text}"
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-radio-button-wrapper")]/span[contains(text(), "${text}")]
  Click                     ${element}

Click switch "${name}" to change button status
  ${element}=               Get Element Form Item By Name     ${name}                       //button[contains(@class, "ant-switch")]
  Click                     ${element}

Click assign list "${list}"
  ${words}=                 Split String                      ${list}                       ,${SPACE}
  FOR    ${word}    IN    @{words}
    Click                   xpath=//*[contains(@class, "ant-checkbox-wrapper")]/*[text()="${word}"]
  END
  Click                     xpath=//*[contains(@class, "ant-transfer-operation")]/button[2]
  Wait Until Element Spin

Click unassign list "${list}"
  ${words}=                 Split String                      ${list}                       ,${SPACE}
  FOR    ${word}    IN    @{words}
    Click                   xpath=//*[contains(@class, "ant-checkbox-wrapper")]/*[text()="${word}"]
  END
  Click                     xpath=//*[contains(@class, "ant-transfer-operation")]/button[1]
  Wait Until Element Spin

Click filter "${name}" with "${text}"
  ${text}=                  Get Random Text                    Text                       ${text}
  ${element}=               Get Element Form Item By Name      ${name}                    //following-sibling::nz-select[contains(@class, "ant-select-show-arrow")]
  Click                     ${element}
  Wait Until Element Spin
  Click                     xpath=//*[contains(@class, "ant-select-item-option") and @title="${text}"]
  ${cnt}=                   Get Length                         ${text}
  IF  ${cnt} > 0
    Set Global Variable     \${STATE["${name}"]}               ${text}
  END
  Wait Until Element Spin

Click on cross icon in select "${name}"
  ${element}=               Get Element Form Item By Name      ${name}                    //following-sibling::nz-select[contains(@class, "ant-select-show-arrow")]
  Click                     ${element}
  Click                     xpath=//span[contains(@class, "anticon-close-circle")]/*[1]

###  -----  Wait feature  -----  ###
Wait Until Element Spin
  Sleep                     ${SHOULD_TIMEOUT}
  ${element}                Set Variable                      xpath=//*[contains(@class, "ant-spin-spinning")]
  ${count}=                 Get Element Count                 ${element}
  IF    ${count} > 0
    Wait Until Page Does Not Contain Element                  ${element}
  END

Wait Until Image Is Uploaded
  ${element}                Set Variable                      //*[contains(@class,'animate-spin')]
  ${cnt}=                   Get Element Count                 ${element}
  IF    ${cnt} > 0
    Wait Until Page Does Not Contain Element                  ${element}
  END

Wait Until Element Is Existent
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  attached              ${timeout}                    ${message}

Wait Until Element Is Visible
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  visible               ${timeout}                    ${message}

Wait Until Page Does Not Contain Element
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  detached              ${timeout}                    ${message}

Wait Until Page Contain Element
  [Arguments]               ${locator}  ${message}=${EMPTY}   ${timeout}=${BROWSER_TIMEOUT}
  Wait For Elements State   ${locator}  attached              ${timeout}                    ${message}

###  -----  Check feature  -----  ###
User look message "${message}" popup
  ${contains}=              Get Regexp Matches                ${message}                    _@(.+)@_                    1
  ${cnt}=                   Get length                        ${contains}
  IF  ${cnt} > 0
    ${message}=             Replace String                    ${message}                    _@${contains[0]}@_          ${STATE["${contains[0]}"]}
  END
  Wait Until Keyword Succeeds                                 ${SHOULD_TIMEOUT}             ${TIME_TRY}                 Element Text Should Be            id=swal2-html-container           ${message}
  ${element}=               Set Variable                      xpath=//*[contains(@class, "swal2-confirm")]
  ${passed}                 Run Keyword And Return Status
                            ...   Element Should Be Visible   ${element}
  IF    '${passed}' == 'True'
        Click               ${element}
  END

Required message "${text}" displayed under "${name}" field
  ${element}=               Get Element Form Item By Name     ${name}                       //*[contains(@class, "ant-form-item-explain-error")]
  Element Text Should Be    ${element}                        ${text}

The data should be reloaded
  Element Should Be Exist                                     //nz-spin[@ng-reflect-nz-spinning = 'true' and descendant::*[contains(@class, "container mx-auto")]]

Data's information in "${name}" should be equal "${value}"
  Wait Until Element Spin
  ${value}=                 Check Text                         ${value}
  ${cnt}=                   Get Element Count                  //label[text()="${name}"]
  IF    ${cnt} > 0
    ${element}=             Get Element Form Item By Name      ${name}                       //*[contains(@class,'ant-input')]
    ${cntS}=                Get Element Count                  ${element}
    IF    ${cntS} > 0
      Get Text              ${element}                         equal                        ${value}
    ELSE
      ${element}=           Get Element Form Item By Name      ${name}                       //*[contains(@class,'ant-select-selection-item')]
      ${cnt2}=              Get Element Count                  ${element}
      IF    ${cnt2} > 0
        Get Text            ${element}                         equal                        ${value}
      ELSE
        ${element}=         Get Element Form Item By Name      ${name}                       //*[contains(@class, "ant-radio-button-wrapper") and contains(@class,'ant-radio-button-wrapper-checked')]/span[contains(text(), "${value}")]
        Wait Until Element Is Existent                         ${element}
      END
    END
  ELSE
    ${element}=             Set Variable                       //th[contains(text(),"${name}")]//following-sibling::th[1]
    Get Text                ${element}                         equal                        ${value}
  END
Data's information in "${name}" of "${tab}" tab should be equal "${value}"
  Wait Until Element Spin
  ${value}=                 Check Text                         ${value}
  ${root}=                  Set Variable                       //*[contains(@class, "ant-tabs-tab-btn") and contains(text(), "${tab}")]//ancestor::*[contains(@class,'ant-tabs-default')]//label[text()='${name}']
  ${cnt}=                   Get Element Count                  ${root}
  IF    ${cnt} > 0
    ${element}=             Set Variable                       ${root}/../../../*[contains(@class,'ant-form-item ant-row')]//descendant::*[contains(@class,'ant-input')]
    ${cntS}=                Get Element Count                  ${element}
    IF    ${cntS} > 0
      Get Text              ${element}                         equal                        ${value}
    ELSE
      ${element}=           Set Variable                       ${root}/../../../*[contains(@class,'ant-form-item ant-row')]//descendant::*[contains(@class,'ant-select-selection-item')]
      ${cnt2}=              Get Element Count                  ${element}
      IF    ${cnt2} > 0
        Get Text            ${element}                         equal                        ${value}
      ELSE
        ${element}=         Set Variable                       ${root}/../..//*[contains(text(),'${value}')]/../*[contains(@class,'ant-radio-button-checked')]
        ${cnt3}=            Get Element Count                  ${element}
        Should Be True      ${cnt3} > 0
      END
    END
  ELSE
    ${element}=             Set Variable                       //th[contains(text(),"${name}")]//following-sibling::th[1]
    Get Text                ${element}                         equal                        ${value}
  END

Data's information should contain "${name}" field
  ${name}=                  Check Text                         ${name}
  ${cnt}=                   Get Element Count                  //label[contains(text(),"${name}")]
  IF    ${cnt} > 0
    Should Be True          ${cnt} >= 1
  ELSE
    ${element}=             Set Variable                      //th[contains(text(),"${name}")]
    Wait Until Element Is Existent                            ${element}
  END

The hidden password in "${name}" field should be visibled as "${text}"
  ${text}=                  Check Text                         ${text}
  ${element}=               Get Element                        //*[contains(@class, "ant-form-item-label")]/label[text()="${name}"]/../../*[contains(@class, "ant-form-item")]//input
  Get Property              ${element}                         type                       ==                             text
  Get Text                  ${element}                         equal                      ${text}

The assign list in "${name}" should contain "${text}"
  ${text}=                  Check Text                         ${text}
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]//ancestor::*[contains(@class,"ant-transfer-list")]//*[contains(@class,'ant-transfer-list-content-item')]//span[contains(text(),"${text}")]
  Wait Until Element Is Existent                               ${element}

The assign list in "${name}" should not contain "${text}"
  ${text}=                  Check Text                         ${text}
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]//ancestor::*[contains(@class,"ant-transfer-list")]//*[contains(@class,'ant-transfer-list-content-item')]//span[contains(text(),"${text}")]
  Wait Until Page Does Not Contain Element                     ${element}

The status of "${name}" switch button should be activated
  ${element}=               Get Element Form Item By Name     ${name}                       //button[contains(@class, "ant-switch")]
  Wait Until Element Is Existent                              ${element}
  Get Property              ${element}                        className                     contains                             ant-switch-checked

The status of "${name}" switch button should not be activated
  ${element}=               Get Element Form Item By Name     ${name}                       //button[contains(@class, "ant-switch")]
  Wait Until Element Is Existent                              ${element}
  Get Property              ${element}                        className                     not contains                         ant-switch-checked

# Check UI or Existence #
Webpage should contain the search function
  ${element}=               Set Variable                       //*[contains(@class,'flex-col')]//label[contains(text(),"Tìm kiếm")]
  ${count}=                 Get Element Count                  ${element}
  ${condition}=             Run Keyword And Return Status      Should Be True               ${count} >= 1
  IF      '${condition}' == 'False'
    ${elementS}=            Set Variable                       //input[contains(@placeholder,"Nhập để tìm kiếm")]//following-sibling::i[contains(@class,'la-search')]
    ${cntS}=                Get Element Count                  ${elementS}
    Should Be True          ${cntS} > 0
  END

Webpage should contain the "${name}" filter function
  ${element}=               Get Element                       //*[contains(@class,'flex-col')]//label[contains(text(),"${name}")]
  ${count}=                 Get Element Count                 ${element}
  Should Be True            ${count} >= 1

Heading should contain "${text}" inner Text
  ${text}=                  Check Text                        ${text}
  ${element}=               Set Variable                      //*[contains(@class, 'text-2xl') and contains(text(),'${text}')]
  Wait Until Element Is Existent                              ${element}

Heading should contain "${text}" title Text
  ${text}=                  Check Text                        ${text}
  ${element}=               Set Variable                      //*[contains(@class,'ant-descriptions-header')]//*[contains(@class, 'ant-descriptions-title') and contains(text(),'${text}')]
  Wait Until Element Is Existent                              ${element}

Webpage should contain "${text}" field located in the "${name}" table
  ${text}=                  Check Text                        ${text}
  ${element}=               Set Variable                      //*[contains(@class,'ant-descriptions-header')]//*[contains(@class, 'ant-descriptions-title') and contains(text(),'${name}')]/../..//*[contains(@class,'ant-descriptions-row')]//*[contains(@class, 'ant-descriptions-item-label') and contains(text(),'${text}')]
  Wait Until Element Is Existent                              ${element}

Heading of separated group should contain "${text}" inner Text
  ${text}=                  Check Text                        ${text}
  ${element}=               Set Variable                      //*[contains(@class,'mx-auto')]//*[contains(@class, 'text-xl') and contains(text(),"${text}")]
  ${cnt}=                   Get Element Count                 ${element}
  IF    ${cnt} > 0
    Wait Until Element Is Existent                            ${element}
  ELSE
    ${element}=             Set Variable                      //*[contains(@class,'mx-auto')]//*[contains(@class, 'text-lg') and contains(text(),'${text}')]
    Wait Until Element Is Existent                            ${element}
  END

Webpage should contain the list data from database
  ${element}=               Get Element                        //div[contains(@class,'datatable-wrapper')]
  ${cnt}=                   Get Element Count                  ${element}
  Should Be True            ${cnt} > 0

Webpage should contain "${name}" assign list
  ${element}=               Set Variable                      //label[contains(text(),'${name}')]/../..//*[contains(@class,'ant-form-item-control-input-content')]
  ${cnt}=                   Get Element Count                 ${element}
  Should Be True            ${cnt} > 0

Webpage should contain "${name}" select field
  ${element}=               Set Variable                       //label[text()="${name}"]//ancestor::*[contains(@class,'ant-row')]//input[contains(@class,'ant-select')]
  ${count}=                 Get Element Count                  ${element}
  Should Be True            ${count} >= 1

Webpage should contain "${name}" input field
  ${cnt}=	                    Get Element Count		              //input[@placeholder='${name}']
  IF	${cnt} > 1 and '${name}' == 'Số điện thoại'
    ${element}=               Set Variable                    //input[@placeholder='${name}' and @id='phoneRegister']
  ELSE IF	${cnt} > 1 and '${name}' == 'Mật khẩu'
    ${element}=               Set Variable                    //input[@placeholder='${name}' and @id='password-register']
  ELSE
    ${element}=               Set Variable                    //input[@placeholder='${name}']
  END
  ${count}=                   Get Element Count                  ${element}
  Should Be True            ${count} >= 1

Webpage should contain "${name}" button
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]
  ${count}=                 Get Element Count                  ${element}
  Should Be True            ${count} >= 1

Webpage should contain "${name}" check button
  ${name}=                  Get Substring                      ${name}        0       10
  ${element}=               Set Variable                       //*[contains(text(),"${name}")]/..//*[contains(@class,'cursor-pointer')]
  ${count}=                 Get Element Count                  ${element}
  Should Be True            ${count} >= 1

Webpage should contain "${name}" switch button
  ${name}=                  Check Text                         ${name}
  ${element}=               Set Variable                       //label[contains(text(),'${name}')]/../..//button[contains(@class,'ant-switch')]
  ${cnt}=                   Get Element Count                  ${element}
  Should Be True            ${cnt} > 0

Webpage should contain left arrow icon
  ${count}=                 Get Element Count                  //i[contains(@class,'la-arrow-left')]
  Should Be True            ${count} > 0

Confirm adding "${url}" page
  ${current_url}=           Get Url
  Should Contain            ${current_url}                     ${URL_DEFAULT}${url}/add

Confirm locating exactly in "${name}" page
  ${cnt}=                   Get Element Count                  //header//span[contains(text(),"${name}")]
  Should Be True            ${cnt} > 0

### Related to images ###
Wait Until Image Visible
  ${elementS}= 		          Get Element 			                 //div[contains(@class,'gslide loaded current')]
  Wait For Elements State                                      ${elementS}                visible

Click on the "${name}" image
  ${element}=	              Get Element 			                 //p[contains(text(),'${name}')]//following-sibling::div//img
  Click	                    ${element}
  Wait Until Image Visible

Image should be enlarged
  ${cnt}=	                  Get Element Count			             //img[contains(@class,'zoomable')]
  Should Be True	          ${cnt} > 0

Click on cross button to close image
  ${element}                Get Element                        //button[contains(@aria-label,'Close')]
  Click                     ${element}

Move to the "${name}" image
  ${element}               Get Element                         //button[contains(@aria-label,'${name}')]
  Click                    ${element}
  Wait Until Image Visible

### Relate to number of list page ###
Count the number data in list
  Wait Until Element Spin
  ${element}=                Set Variable                      xpath=//tbody//tr[contains(@class, 'ant-table-row')]
  ${count}=                  Get Element Count                 ${element}
  IF    ${count} <= 0
    Wait Until Element Spin
    ${count}=                Get Element Count                 ${element}
    ${count}=                Convert To Integer                ${count}
  ELSE
    ${count}=                Convert To Integer                ${count}
  END
  [Return]                   ${count}

Get number data list in last page
  ${element}=                Get Element                       //span[contains(@class, 'ml-3')]
  ${text}=                   Get Text                          ${element}
  ${pageNum}=                Count the number data in list
  ${total}=                  Get Regexp Matches                ${text}                     của (.+) mục                1
  ${total}=                  Convert To Integer                ${total[0]}
  ${NumberAcc}=              Evaluate                          ${total} % ${pageNum}
  IF    ${NumberAcc} == 0
    ${NumberAccount}=        Set Variable                      ${pageNum}
  ELSE
    ${NumberAccount}=        Set Variable                      ${NumberAcc}
  END
  [Return]                   ${NumberAccount}

Get the number of total data
  ${element}=                Get Element                       //span[contains(@class, 'ml-3')]
  ${text}=                   Get Text                          ${element}
  ${total}=                  Get Regexp Matches                ${text}                     của (.+) mục                1
  ${total}=                  Convert To Integer                ${total[0]}
  ${cnt}=                    Get Length                        ${text}
  IF  ${cnt} > 0
    ${TotalAccount}=         Set Variable                      ${total}
  END
  [Return]                   ${TotalAccount}

Get the last page number
  ${element}=                Get Element                       //span[contains(@class, 'ml-3')]
  ${text}=                   Get Text                          ${element}
  ${pageNum}=                Count the number data in list
  ${totalP}=                 Get Regexp Matches                ${text}                     của (.+) mục                1
  ${totalP}=                 Convert To Integer                ${totalP[0]}
  ${con}=                    Evaluate                          ${totalP} % ${pageNum}
  IF    ${con} == 0
    ${lastPN}=               Evaluate                          ${totalP}//${pageNum}
  ELSE
    ${lastPN}=               Evaluate                          (${totalP}//${pageNum})+1
  END
  ${cnt}=                    Get Length                        ${text}
  IF  ${cnt} > 0
    ${lastPageNumber}=       Set Variable                      ${lastPN}
    ${lastPageNumber}=       Convert To String                 ${lastPageNumber}
  END
  [Return]                   ${lastPageNumber}

Check the amount of page list
  Wait Until Element Spin
  ${countA}=                 Count the number data in list
  ${totalA}=                 Get the number of total data
  IF    ${countA} == ${totalA}
    ${amountPage}=           Set Variable                      1
    Pass Execution           'This list contains only one page'
  ELSE IF    ${countA} < ${totalA}
    ${amountPage}=           Evaluate                          (${totalA}//${countA})+1
    ${amountPage}=           Set Variable                      ${amountPage}
  END
  [Return]                   ${amountPage}

### --- List of account navigation --- ###
Move to the "${target}" page
  ${count}=                   Get Length                       ${target}
  IF    '${target}' == 'previous'
      Click                   xpath=//*[contains(@class, "las la-angle-left text-xs ng-star-inserted")]
  ELSE IF    '${target}' == 'next'
      Click                   xpath=//*[contains(@class, "las la-angle-right text-xs ng-star-inserted")]
  ELSE
      ${number}=              Convert To Integer    ${target}
      Click                   xpath=//a[contains(@aria-label, "page ${number}")]
  END
  Wait Until Element Spin

Move to the last page and check
  ${countS}=                  Get number data list in last page
  ${number}=                  Get the last page number
  Move to the "${number}" page
  Wait Until Element Spin
  ${elementS}=                Set Variable                     xpath=//tbody//tr[contains(@class, 'ant-table-row')]
  ${count}=                   Get Element Count                ${elementS}
  ${count}=                   Convert To Integer               ${count}
  Should Be Equal             ${count}                         ${countS}

Click on "${ordinal}" selection to change the number of data show in list and check
  Wait Until Element Spin
  ${cnt}=                       Get Length                      ${ordinal}
  IF        ${cnt} > 3 and '${ordinal}' == 'first'
    ${select}=                  Set Variable                    1
  ELSE IF   ${cnt} > 3 and '${ordinal}' == 'second'
    ${select}=                  Set Variable                    2
  ELSE IF   ${cnt} > 3 and '${ordinal}' == 'third'
    ${select}=                  Set Variable                    3
  ELSE IF   ${cnt} > 3 and '${ordinal}' == 'fourth'
    ${select}=                  Set Variable                    4
  ELSE IF   ${cnt} > 3 and '${ordinal}' == 'fifth'
    ${select}=                  Set Variable                    5
  ELSE
    ${select}=                  Convert To Integer              ${ordinal}
  END
  ${amountPage}=                Check the amount of page list
  ${text_current}=              Get Text                        //g-pagination//*[contains(@class, 'ant-select-selection-item')]
  ${current}=                   Get Regexp Matches              ${text_current}                           (.+) / page                    1
  ${current_number}=            Set Variable                    ${current[0]}
  ${current_number}             Convert To Integer              ${current_number}
  Click                         xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
  ${text_select}=               Get Text                        //nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
  ${select_string}=             Get Regexp Matches              ${text_select}                            (.+) / page                    1
  ${select_number}=             Set Variable                    ${select_string[0]}
  ${select_number}=             Convert To Integer              ${select_number}
  IF                            ${amountPage} >= 2
    IF                          ${current_number} < ${select_number}
      Move to the "next" page
      ${name}=                  Get data in the first row
      ${ordinal_before}=        Evaluate                        ${current_number} + 2
      Click                     xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
      Wait Until Element Spin
      Click                     xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
      Wait Until Element Spin
      Get Text                  //tbody//tr[${ordinal_before}]//button[contains(@title,"Chi tiết")]        equal                       ${name}
    ELSE IF                     ${current_number} > ${select_number}
      ${ordinal_before}=        Evaluate                        ${select_number} + 2
      ${name}=                  Get Text                        //tbody//tr[${ordinal_before}]//button[contains(@title,"Chi tiết")]
      Click                     xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
      Wait Until Element Spin
      Click                     xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
      Wait Until Element Spin
      Move to the "next" page
      ${nameS}=                 Get data in the first row
      Should Be Equal           ${nameS}                         ${name}
      Move to the "previous" page
    ELSE IF                     ${current_number} = ${select_number}
      Click                     xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
      Wait Until Element Spin
      Click                     xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
      Wait Until Element Spin
    END
  ELSE IF                       ${amountPage} < 2
    IF                          ${current_number} <= ${select_number}
      Click                     xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
      Wait Until Element Spin
      Click                     xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
      Wait Until Element Spin
    ELSE IF                     ${current_number} > ${select_number}
      ${account_number}=        Count the number data in list
      IF       ${account_number} > ${select_number}
        ${ordinal_before}=      Evaluate                         ${select_number} + 2
        ${name}=                Get Text                         //tbody//tr[${ordinal_before}]//button[contains(@title,"Chi tiết")]
        Click                   xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
        Wait Until Element Spin
        Click                   xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
        Wait Until Element Spin
        Move to the "next" page
        ${nameS}=               Get data in the first row
        Should Be Equal         ${nameS}                         ${name}
        Move to the "previous" page
      ELSE IF    ${account_number} <= ${select_number}
        Click                   xpath=//g-pagination//*[contains(@class, 'ant-select-selection-item')]
        Wait Until Element Spin
        Click                   xpath=//nz-option-item[${select}]/div[contains(@class,'ant-select-item-option-content')]
        Wait Until Element Spin
      END
    END
  END

### --- Get the data information --- ###
Get data in the last row
  ${pageN}=                   Count the number data in list
  ${number}=                  Evaluate                         ${pageN}+1
  ${element}=                 Get Element                      //tbody//tr[${number}]//button[contains(@title,"Chi tiết")]
  ${LAname}=                  Get Text                         ${element}
  ${cnt}=                     Get Length                       ${LAname}
  IF   ${cnt} > 0
    Set Global Variable       \${LAname}                        ${LAname}
  END
  [Return]                    ${LAname}

Get data in the first row
  ${element}=                 Get Element                      //tbody//tr[2]//button[contains(@title,"Chi tiết")]
  ${Fname}=                   Get Text                         ${element}
  ${cnt}=                     Get Length                       ${Fname}
  IF   ${cnt} > 0
    ${Fname}=                 Set Variable                     ${Fname}
  END
  [Return]                    ${Fname}

Get data in the selecting category
  ${element}=                Set Variable                      //*[contains(@class,'item') and contains(@class,'bg-blue-100')]/span
  ${text}=                   Get Text                          ${element}
  ${text}=                   Get Regexp Matches                ${text}                 ${SPACE}(.+)                    1
  ${text_after}=             Convert to String                 ${text[0]}
  [Return]                   ${text_after}
