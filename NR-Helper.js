var assert = require('assert');
const {
    randomBytes,
} = await import('node:crypto');
var stepCounter = 0;


//HELPER FUNCTIONS
//adds a time stamp to log output in UTC
function logger(string){
    var dateTimeObject = new Date();
    let time_dirty;
    time_dirty = dateTimeObject.toTimeString();
    let time;
    time = time_dirty.replace("GMT+0000 (Coordinated Universal Time)","UTC | ");
    console.log(time+string);
}

async function assertElementValue(step, assertType, actual, expected) {
    try {
        let value;
        if (actual) {
            value = await actual.getText();
        }
        assertValue(step, assertType, value, expected);
    } catch (e) {
        throw({ type: 'Step error', message: e.message, step: step });
    }
}

//function uses assert.ok to assertValue of actual based on the assertType provided
function assertValue(step, assertType, actual, expected) {
    var assertionFailureMessage = 'Step monitor failure - Failed on step #' + (step + 1) + ' - Assertion Failure - ';
    switch (assertType) {
        case '==':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"';
            if(actual == expected){
                logger('"' + actual + '" is equal to\n"' + expected + '"');
            }
            assert.ok(actual == expected, assertionFailureMessage);
            break;
        case '!=':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"';
            if(actual != expected){
                logger('"' + actual + '" is NOT equal to\n"' + expected + '"');
            }
            assert.ok(actual != expected, assertionFailureMessage);
            break;
        case '<=':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"';
            if(actual <= expected){
                logger('"' + actual + '" is less than or equal to\n"' + expected + '"');
            }
            assert.ok(actual <= expected, assertionFailureMessage);
            break;
        case '>=':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"';
            if(actual >= expected){
                logger('"' + actual + '" is greater than or equal to\n"' + expected + '"');
            }
            assert.ok(actual >= expected, assertionFailureMessage);
            break;
        case '<':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"'
            if(actual < expected){
                logger('"' + actual + '" is less than\n"' + expected + '"');
            }
            assert.ok(actual < expected, assertionFailureMessage);
            break;
        case '>':
            assertionFailureMessage += 'Expected: "' + expected + '", Actual: "' + actual + '"';
            if(actual > expected){
                logger('"' + actual + '" is greater than\n"' + expected + '"');
            }
            assert.ok(actual > expected, assertionFailureMessage);
            break;
        case '%=':
            assertionFailureMessage += '"' + expected + '" was not found in "' + actual + '"';
            if(actual.includes(expected)){
                logger('"' + actual + '"\n includes the following string:\n[' + expected + ']');
            }
            assert.ok(actual.includes(expected), assertionFailureMessage);
            break;
        case '!%=':
            assertionFailureMessage += '"' + expected + '" was found in "' + actual + '"';
            if(!actual.includes(expected)){
                logger('"' + actual + '"\n DOES NOT include the following string:\n[' + expected + ']');
            }
            assert.ok(!actual.includes(expected), assertionFailureMessage);
            break;
    }
}


async function assertElement(step, assertType, actual, expected) {
    var expectedBoolean = (expected === 'true');
    var assertionFailureMessage = 'Step monitor failure - Failed on step #' + (step + 1) + ' - Assertion Failure - ';
    try {
        if (assertType == 'visible' && actual != null) {
            let state;
            if (actual){
                state = await actual.isDisplayed();
            }
            assertionFailureMessage += 'Expected state: "' + expectedBoolean + '", Actual state: "' + state + '"';
            assert.equal(state, expectedBoolean, assertionFailureMessage);
        } else {
            assertionFailureMessage += 'Expected state: "' + expectedBoolean + '", Actual state: "' + !!actual + '"';
            assert.equal(!!actual, expectedBoolean, assertionFailureMessage);
        }
    } catch (e) {
        throw({ type: 'Step error', message: e.message, step: step });
    }
}


async function findElement(step, selector) {
    try {
        let e = await $browser.waitForElement($driver.By.xpath(selector),15000);
        logger('Found first element by xpath with selector: <' + selector + '>');
        return e;
    } catch (err) {
        logger('Element not found by xpath, trying CSS...');
    }

    try {
        let e = await $browser.waitForElement($driver.By.css(selector),15000);
        logger('Found first element by CSS with selector: <' + selector + '>');
        return e;
    } catch (err) {
        logger('Element not found by CSS, trying partial link text...');
    }

    try {
        let e = await $browser.waitForElement($driver.By.partialLinkText(selector),15000);
        logger('Found first element by partial link text with selector: <' + selector + '>');
        return e;
    } catch (err) {
        logger('Element not found by partial link text, trying ID...');
    }

    try {
        let e = await $browser.waitForElement($driver.By.id(selector),15000);
        logger('Found first element by ID with selector: <' + selector + '>');
        return e;
    } catch (err) {
        throw({
            type: 'Step error',
            message:
                'Step monitor failure - Failed on step #' +
                (step + 1) +
                ' - Could not locate element by XPath, CSS Selector, partial link text, or HTML ID - selector: <' +
                selector +
                '>',
            step: step,
            selector: selector,
        });
    }
}

//used to create a unique email address to simulate a guest/new user
async function generateRandomEmailAddress(){
    var account = randomBytes(5).toString('hex');
    var domain = randomBytes(5).toString('hex');
    let randomEmailAddress;
    randomEmailAddress = account+"@"+domain+".com";
    return randomEmailAddress;
}


//STEP FUNCTION
//the following functions each represent 1 step in a scripted browser test case

//navigate to URL
async function stepGetUrl(url){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Navigating to "'+url+'"');
    await $browser.get(url)
}


//find element & click
async function stepClickElement(locator){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Clicking on element with locator: <'+locator+'>');
    let buttonElement;
    buttonElement = await findElement(stepCounter, locator);
    await buttonElement.click();
}

//find element, click, & wait for element clicked to become stale
async function stepClickElementWaitStaleness(locator){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Clicking on element with locator: <'+locator+'>');
    let buttonElement;
    buttonElement = await findElement(stepCounter, locator);
    await buttonElement.click();
    logger('waiting for new page..')
    await $browser.wait($driver.until.stalenessOf(buttonElement));
}

//find element, click, & wait for the given amount of time
async function stepClickElementWait(locator,wait){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Clicking on element with locator: <'+locator+'>');
    let buttonElement;
    buttonElement = await findElement(stepCounter, locator);
    await buttonElement.click();
    logger('waiting for page to load..')
    await $browser.sleep(wait);
}

//find element & send keys
async function stepSendKeysToElement(locator,keys){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Entering text into element with selector: <' + locator + '>');
    let inputElement;
    inputElement = await findElement(stepCounter, locator);
    await inputElement.clear();
    await inputElement.sendKeys(keys);
}

//find a select list, and click wanted option
async function stepChooseOptionFromList(selectListLocator,wantedOption){
    stepCounter++;
    logger('\n\nStep ' + (stepCounter));
    logger('Selecting option element with locator: <'+selectListLocator+'>');
    let selectList;
    selectList = await findElement(stepCounter, selectListLocator);
    let options;
    options = await selectList.findElements($driver.By.tagName('option'));
    logger('Found WebElement with Selector <'+selectListLocator+'>, Searching for Option: <'+wantedOption+'>');
    var optionFound = false;
    for (const option of options) {
        let value;
        value = await option.getAttribute("value");
        let text;
        text = await option.getText();
        if (wantedOption === value || wantedOption === text){
            await option.click();
            optionFound = true;
            break;
        }
    }
    if (!optionFound){
        throw({ type: 'Step error', message: 'Step monitor failure - Failed on step #'+stepCounter+' - Could not locate element by value or name - option: <' + wantedOption + '>', step: stepCounter, option: wantedOption });
    }
}

//assert the value of the current page's title
async function stepAssertTitle(assertType,expected){
    stepCounter++
    logger('\n\nStep ' + (stepCounter));
    let title;
    title = await $browser.getTitle();
    logger("Checking page title: "+title);
    await assertValue(stepCounter,assertType,title,expected);
}

//assert text of a given element
async function stepAssertElementText(locator,assertType,expected){
    stepCounter++
    logger('\n\nStep ' + (stepCounter));
    logger('Checking for text: "'+expected+'" of element with locator: <' +locator+'>')
    let element;
    element = await findElement(stepCounter, locator);
    let elementText;
    elementText = await element.getText();
    let elementTextLower;
    elementTextLower = await elementText.ToLowerCase();
    expectedLower = await expected.ToLowerCase();
    assertValue(stepCounter,'==',elementTextLower,expectedLower);
}

//assert that the current page is preprod
async function stepAssertOnPreprod(){
    stepCounter++;
    console.log('\n\nStep ' + (stepCounter));
    console.log('Checking text: "preprod" is in url');
    await $browser.wait($driver.until.urlContains('preprod'));
    let currentUrl;
    currentUrl = await $browser.getCurrentUrl();
    assertValue(stepCounter,'%=',currentUrl,'preprod');
}



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