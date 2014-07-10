({
    /*
     * Test verifying that when there is no data present dataGrid does not fail
     */
    _testNoDataPresent : {
        attributes : {"pageSize" : 0},
        test : function(cmp){
            this.verifyDataGridUsingPager(cmp, [true,true,true,true],"0 - 0 of 0");
        }
    },

    /*
     * Basic test case where we look at an average number of data and make sure paging accounts for it
     */
    testWithAverageData : {
        attributes : {"pageSize" : 99},
        test : function(cmp){
            this.verifyDataGridUsingPager(cmp, [true, true, false, false], 99, "1 - 99 of 495");
        }
    },
    
    /*
     * Making sure that we are able to page to the next page and that we are able to page to previous and next pages
     */
    testStartingOnDifferentPage : {
        attributes : {"pageSize" : 100, "currentPage" : 2},
        test : function(cmp){
            this.verifyDataGridUsingPager(cmp, [false, false, false, false], 100, "101 - 200 of 500");
        }
    },
    
    /*
     * Start at last possible page, then verify that last paging elements acknowledge the change
     */
    _testWithLargeData : {
        attributes : {"pageSize" : 3000, "currentPage" : 5},
        test : function(cmp){
            this.verifyDataGridUsingPager(cmp,[false, false, true, true], 3000, "12001 - 15000 of 15000");
        }
    },
    
    /*
     * Testing pagination with sortby attribute
     */
    testPagination : {
        attributes : {"pageSize" : 50, "currentPage" : 1, "sortBy" : "-id"},
        test : function(cmp){          
            var pager = cmp.find("pagerNextPrev").find("pager:next").getElement();
            this.verifySortedElements(cmp, pager, "100", "51", "We are on the wrong page, we should be on row 51-100")
        }
    },
    
    /*
     * testing sorting by elements (i.e. click on sort button)
     */
    testSorting : {
        attributes : {"pageSize" : 50, "currentPage" : 1},
        test : function(cmp){
                var anchor = $A.test.getElementByClass("toggle")[0];
                this.verifySortedElements(cmp, anchor, "50", "1", "We are on the wrong page, we should be on row 50-1");               
        }
    },
    
  //Currently fails because of known bug: TODO -- ADD BUG NUM
    /*
     * Test that all items selected are valid in v.items and v.selectedItems
     * 
     *  CURRENTLY FAILS TRACKED IN BUG: 
     */
    _testItemsSelectAttribute : {
        test : function(cmp){
            var elements = this.getRowElements(cmp, 100);
            var trs = elements[0];

            //Select the first 2 elements (excluding select all)
            this.selectCheckBox(0, 1, trs);
            this.verifySelectedElements(cmp, this.createOutputArray(1, 2,  ["Foo", "John Doe", "Acme", "2014-01-01"]), trs);

            //Select the head checkbox to select all
            var thead = document.getElementsByTagName("thead")[0];
            this.selectCheckBox(0, 0, thead.children);

            //Verify that everything is correctly selected
            this.verifySelectedElements(cmp, this.createOutputArray(1, 100,  ["Foo", "John Doe", "Acme", "2014-01-01"]), trs);
        }
    },

    /*
     * Test that selecting and pagination still work correctly
     */
    testSelectingDeselectingItemsWithPaginations : {
        test : function(cmp){
            //Select all items
            var thead = document.getElementsByTagName("thead")[0];
            this.selectCheckBox(0, 0, thead.children);

            //Deselect two rows
            var elements = this.getRowElements(cmp, 100);
            var trs = elements[0];
            this.selectCheckBox(0, 1, trs);

            //Go to next page
            var pager = cmp.find("pagerNextPrev").find("pager:next").getElement();
            $A.test.clickOrTouch(pager);

            //Get current amount of trs in body
            this.verifyNumberOfTrs(100, cmp.find("grid").getElement());           
        }
    }, 

    /*
     * Add multiple items in Asynchornously and make sure that basic functionality still works (add/remove in v.items)
     */
    testAddingElementsInAsyncly : {
        attributes : {"pageSize" : 0, "numItems2Create" : 100},
        test : [function(cmp){
        	//Verify the page is empty
        	var elements = this.getRowElements(cmp, 0);
            var trs = elements[0];
            $A.test.assertEquals(0, trs.length, "there should be no rows on the page")
            },function(cmp) {
            	//Add rows in and wait for them to be present
        		this.pressButton(cmp, "addRow");
	        	 $A.test.addWaitFor(true, function() {
	     			return document.getElementsByTagName("tbody")[0].children.length > 0;
	     		});
        	},function(cmp){
        		//verify that the row is correct 
        		this.checkBasicElements(cmp, ["6000", "Spidey 6000", "Peter Parker 6000", "Media Inc 6000", "2020-10-12 6000"],
                		["6050", "Spidey 6050", "Peter Parker 6050", "Media Inc 6050", "2020-10-12 6050"],
                		["6099", "Spidey 6099", "Peter Parker 6099", "Media Inc 6099", "2020-10-12 6099"]
                		);
        		//Add an element to the row and verify insert and removing still work
                this.setValue(cmp, "index", 0);
                this.setValue(cmp, "count", 2);
                this.insertRemoveAndVerify(cmp, 0, this.createOutputArray(6100, 6101, ["Bar", "New John", "SFDC", "2014-11-11"]),
                                           this.createOutputArray(6000, 6000,  ["Spidey", "Peter Parker", "Media Inc", "2020-10-12"]), 102, 100);
        	}]
    },
    //Test what is being displayed, and also what is stored in the internal cache
    /*
     * Basic test validating that what is being displayed through the grid is there
     */
    testDisplayedItemsAreCorrect : {
        test : function(cmp){
            this.checkBasicElements(cmp, ["1", "Foo 1", "John Doe 1", "Acme 1", "2014-01-01 1"], 
            		["51", "Foo 51", "John Doe 51", "Acme 51", "2014-01-01 51"], 
            		["100", "Foo 100", "John Doe 100", "Acme 100", "2014-01-01 100"]);
        }
    },
    
    /*
     * Insert single item into grid
     */
    testInsertionOfSingleItem : {
        test : function(cmp){

            //Set Intial values for how many items to create, the insert and remove said elements multiple times to verify v.items keeps track
            this.setValue(cmp, "index", 1);
            this.setValue(cmp, "count", 2);
            this.insertRemoveAndVerify(cmp, 1, this.createOutputArray(6000, 6001, ["Bar", "New John", "SFDC", "2014-11-11"]),
                                       this.createOutputArray(2, 3,  ["Foo", "John Doe", "Acme", "2014-01-01"]), 102, 100);
            
            this.insertRemoveAndVerify(cmp, 1, this.createOutputArray(6002, 6003, ["Bar", "New John", "SFDC", "2014-11-11"]),
                                       this.createOutputArray(2, 3,  ["Foo", "John Doe", "Acme", "2014-01-01"]), 102, 100);

        }
    },
    
    /*
     * Insert a large amount of elements, remove only a portion of it and see how v.items reacts
     */
    testStaggeredInsertionRemove : {
        test : function(cmp){
            this.setValue(cmp, "index", 50);
            this.setValue(cmp, "count", 20);

            //Set up for insert remove
            var valuesAfterInsert = this.createOutputArray(6000, 6019, ["Bar", "New John", "SFDC", "2014-11-11"]);
            var valuesAfterRemove = this.createOutputArray(51, 69,  ["Foo", "John Doe", "Acme", "2014-01-01"]);
            this.insertRemoveAndVerify(cmp, 50, valuesAfterInsert, valuesAfterRemove, 120, 100);
            
            valuesAfterInsert = this.createOutputArray(6020, 6039, ["Bar", "New John", "SFDC", "2014-11-11"]);
            //Since the array is not correct now, concat new items with old to make sure the correct element was not destroyed
            valuesAfterRemove = this.createOutputArray(6030, 6039, ["Bar", "New John", "SFDC", "2014-11-11"])
            valuesAfterRemove = valuesAfterRemove.concat(this.createOutputArray(51, 69,  ["Foo", "John Doe", "Acme", "2014-01-01"]));

            //Insert and remove elements
            this.insertRemoveAndVerify(cmp, 50, valuesAfterInsert, valuesAfterRemove, 120, 110, 10);
            
        }
    },

    /**************************************************************************************************
     * Helper functions              
     **************************************************************************************************/
    /*
     * Basic check used in multiple places
     */ 
    checkBasicElements : function(cmp, firstRow, midRow, lastRow){
        //Get elements to use (trs and elements that are in v.items)
        var elements = this.getRowElements(cmp, 100);
        var trs = elements[0];
        var itemsInBody = elements[1];
        
        //verify first, middle and last item are correct
        this.verifyRow(trs[0].children, itemsInBody[0],   firstRow);
        this.verifyRow(trs[50].children, itemsInBody[50], midRow);
        this.verifyRow(trs[99].children, itemsInBody[99], lastRow);
    },

    /*
     * Items that have the checkbox selected should be in v.selected, verify that these items are correct
     */ 
    verifySelectedElements : function(cmp, expectedItemsSelected, trs){
    	//setup
        var selected = this.getGridAttribute(cmp, "selectedItems"),
            expectedLen = expectedItemsSelected.length;
        //Verify that v.selected is the length that we expect
        $A.test.assertEquals(expectedLen, selected.length, "There number of items that were selected does not match what is in the selected cache");

        //verify that items are correct
        var expectedObj = null, 
            selObj = null;

        for(var i = 0; i < expectedLen; i++){
           this.verifyRow(trs[i].children, selected[i], expectedItemsSelected[i]);
        }
    },

    /*
     * Select x amount of checkboxes (in this case get the inputs)
     */ 
    selectCheckBox : function(beginElm, endElm, rows){

        //This is backwards because the selected cache pushes stack like (FILO)
        for(var i = endElm; i >= beginElm; i--){
            $A.test.clickOrTouch(rows[i].children[0].children[0]);
        }
    },

    /*
     * Function, that given a number (start) and values  will create and return an expected array
     */ 
    createOutputArray : function(start, end, arrayValues){
       var outputArray = [], tmpArray;
        
       for(start; start<=end; start++){
    	   tmpArray = [""+start];
    	   for(var i = 0; i < arrayValues.length; i++){
    		   tmpArray.push(arrayValues[i] +" "+start);
    	   }
    	   outputArray.push(tmpArray);
        }
        
        return outputArray;
    },

    /*
     * Function that will insert element, then remove them and verify that the rows look the way we feel they should
     */ 
    insertRemoveAndVerify : function(cmp, startRow, newExpectedRows, oldExpectedRows, colCountNew, colCountOrig, changeRemoveValue){
    	
    	//Insert the new items
        this.actAndVerifyRowIsCorrect(cmp, "insert", startRow, newExpectedRows,colCountNew);
        //Used in the case that we want to remove less items
        if(!$A.util.isUndefinedOrNull(changeRemoveValue)){
            this.setValue(cmp, "count", changeRemoveValue);
        }
        
        //Remove items
        this.actAndVerifyRowIsCorrect(cmp, "remove", startRow, oldExpectedRows, colCountOrig);

    },
    
    /*
     * Perform an action (insert or remove), verify that everything is as expected
     */
     actAndVerifyRowIsCorrect : function(cmp, actionId, index, expectedRow, expectColCount){
    	 this.pressButton(cmp, actionId);
    	//Get how the row looks
         var elements = this.getRowElements(cmp, expectColCount);
         var trs = elements[0];
         var itemsInBody = elements[1];

         //Verify that items have been set to the correct position
         for(var i = 0; i < expectedRow.length; i++, index++){
             this.verifyRow(trs[index].children, itemsInBody[index], expectedRow[i]);
         }
         
     },
     
    /*
     * Extracing out set value code 
     */ 
    setValue : function(cmp, id, value){
         cmp.find(id).set("v.value", value);
    },

    /*
     * extracting out the press function
     */ 
    pressButton : function(cmp, id){
          cmp.find(id).get("e.press").fire({});
    },

    /*
     * Verify that each row element is correct and does what we want it to
     */ 
    verifyRow : function(domRow, cmpRow, expectedRow){
        var keys = ["id", "subject", "name", "relatedTo", "date"];
        $A.test.assertEquals($A.test.getElementAttributeValue(domRow[0].children[0], "type"), "checkbox", "Row element data does not match what it show be");
        
        for(var i = 1; i < domRow.length; i++){
            $A.test.assertEquals($A.util.getText(domRow[i]), ""+expectedRow[i-1], "Row element data does not match what it show be");
            $A.test.assertEquals(""+cmpRow[keys[i-1]], expectedRow[i-1], "Row data stored in cmp data does not match what it show be");
        }
    },
    
    /*
     * Get a grid attribute
     */ 
    getGridAttribute : function( cmp, attributeName){
        return cmp.find("grid").get("v."+attributeName);
    },

    /*
     * get specific row elements
     */ 
    getRowElements : function(cmp, colCount){
            var tbody = document.getElementsByTagName("tbody")[0];
            var trs = tbody.children;
            var itemsInBody = this.getGridAttribute(cmp, "items");

            $A.test.assertEquals(colCount, trs.length, "The total amount of items on the page are incorrect");
            $A.test.assertEquals(colCount, itemsInBody.length, "The total amount of elements in v.items is incorrect");

            return [trs, itemsInBody];
    },

    /*
     * Verify that the elements we sorted are correct sorted
     */
    verifySortedElements : function(cmp, element, firstRowId, lastRowId, message){
            //Click on the next button
            $A.test.clickOrTouch(element);

            //grabbing first and last item making sure that they are sorted
            var trs = this.getRowElements(cmp, 50)[0];
            var firstTr = $A.util.getText(trs[0]);
            var lastTr = $A.util.getText(trs[trs.length - 1]);
                
            //Check to make sure that the first and last intem in the
            $A.test.assertTrue(firstTr.indexOf(firstRowId) > -1, message);
            $A.test.assertTrue(lastTr.indexOf(lastRowId) > -1, message);
    },
    
    /*
     * Extract out function that will go through all of the pager items and make sure they are set correctly
     */ 
    verifyDataGridUsingPager : function(cmp, pagerState, pageSize, pagerMessage){
            //Getting pager and making sure that the nummbe of trs are correct
    	    var pager = cmp.find("pagerNextPrev");
           
            //
            this.verifyPageInfoSaysCorrectNumber(cmp.find("pageInfo"), pagerMessage);
            this.verifyElementDisabled(pager, 
                ["pager:first","pager:previous", "pager:next","pager:last"], 
                pagerState);
    },

    /*
     * Check to make sure that the pager says the correct page and element we are on
     */ 
    verifyPageInfoSaysCorrectNumber : function (cmp, expectedText){
        $A.test.assertEquals($A.test.getTextByComponent(cmp), expectedText, "There should be not elements through pagerinfo");        
    },
    
    /*
     * check to make sure that we are getting the correct trs and verify it is the correct size
     */ 
    verifyNumberOfTrs : function(number, tbl){
        var trs = tbl.getElementsByTagName("tbody")[0].children;
        $A.test.assertEquals(number, trs.length, "The correct number of trs ("+number+") is currently not in the table");
    },
    
    /*
     * Verifying that the pager we expect to be disabled is disabled
     */ 
    verifyElementDisabled : function(cmp, pagerIds, disabled){
        var pagerText = "", 
            assertValue = "",
            message = "";
        
        for(var i = 0; i < pagerIds.length; i++){
        	 //Getting text to make sure that the pager is disabled
             pagerText = $A.test.getTextByComponent(cmp.find(pagerIds[i])).toLowerCase();
            

             //If it is disabled check error message
             if(disabled[i] !== true){
                assertValue = pagerText.indexOf("disabled") == -1; 
                message = pagerIds[i]+" was disabled and it should not be";
             }
             else{
            	 assertValue = pagerText.indexOf("disabled") >= 0;
                 message = pagerIds[i]+" was not disabled and it should be";
             }
        
             $A.test.assertTrue(assertValue, message);
        }   
    }
    
})