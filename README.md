# New-Relic-ScriptedBrowser-helper-functions
used to quickly build up scripted browser test in New Relic.

# Description
The following functions each represent 1 step in a scripted browser test case.
If steps should be executed in order be sure to make use of "await"

# Step Functions

### stepGetUrl
#### param:
* url - string - url you would like to navigate to.
#### use: 
* navigates to URL and logs event on console with time stamp

### stepClickElement
#### param:
* locator - string - locator used to find element you would like to click
#### use: 
* click an element and log event on console with time stamp

### stepClickElementWaitStaleness
#### param:
* locator - string - locator used to find element you would like to click
#### use: 
* click an element and wait for that element to become stale before continue, log event with time stamp

### stepClickElementWait
#### param:
* locator - string - locator used to find element you would like to click
* wait - int - milliseconds that the browser will wait before continue
#### use:
* click an element and wait the given time before continue. log event in console with time stamp

### stepSendKeysToElement
#### param:
* locator - string - locator used to find element you would like send keys to
* keys - string - keys to be sent to element
#### use: 
* find an element, clear it, and send keys. log event in console with time stamp

### stepChooseOptionFromList
#### param:
* selectListLocator - string - locator used to find select list you would like to interact with
* wantedOption - string - the name of the option you would like to select from list
#### use: 
* find select list element and set it to wanted option. log event in console with time stamp

### stepAssertTitle
#### param:
* assertType - string - method you would like to use to compare expected and actual text
    * '==' - is equal to
    * '!=' - is not equal to
    * '<=' - is less than or equal to
    * '>=' - is greater than or equal to
    * '<' - is less than
    * '>' - is greater than
    * '%=' - contains
    * '!%=' - does not contain
* expected - string - the text that is considered a passed assert
#### use: 
* assert the current page title to the expected page title. log event in console with time stamp

### stepAssertElementText
#### param:
* locator - string - locator used to find element you would like to assert
* assertType - string - see above for options
* expected - string - the text that is considered a passed assert
#### use: 
* assert the current element text to the expected element text. log event in console with time stamp

### stepAssertOnPreprod
#### param: NA
#### use: 
* assert that the browser is currently pointed to a preprod environment. log in console with time stamp

# Example Use #
```
//TEST CASE BEGINS
await stepGetUrl("https://formsmarts.com/form/yx?mode=h5embed&lay=1");

firstNameLocator = '//input[@placeholder="Your first name"]';
await stepSendKeysToElement(firstNameLocator,'Tester');

lastNameLocator = '//*[@id="f"]//input[@placeholder="Your last name"]';
await stepSendKeysToElement(lastNameLocator,'Jones')

emailLocator = '//*[@id="f"]//input[@placeholder="Your email address"]';
exampleEmail = "example@example.com"
await stepSendKeysToElement(emailLocator,exampleEmail);

listLocator = '//*[@id="f"]//select';
option = 'Website Feedback';
await stepChooseOptionFromList(listLocator,option);

inquiryLocator = '//*[@id="f"]//textarea';
inquiry = 'I like your website! Super good! Keep up the good work!';
await stepSendKeysToElement(inquiryLocator,inquiry);

submitLocator = '//*[@id="f"]//input[@name="submit"]';
await stepClickElementWaitStaleness(submitLocator);

confirmLocator = '//*[@name="conf"]//input[@type="submit"]';
await stepClickElementWaitStaleness(confirmLocator);

confirmationLocator = '/html/body/div/p';
expected = "The form was submitted successfully. Thank you.";
await stepAssertElementText(confirmationLocator,'==','The form was submitted successfully. Thank you.');
//TEST CASE ENDS
```

## License

This project is licensed under the BSD 3-Clause License - see the LICENSE.md file for details
