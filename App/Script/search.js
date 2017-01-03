//Global vars
var lastSearchValue; //Used to compare with current search value
var searchResultViewIsActive = false; //Stops search result from hiding when search field is blured.

$(document).ready(function () {

    //Handle search result user interactions
    $("#search-results").on("click", "li", function () {
        saveSearch($(this).html());
    }).on("mouseenter", "li", function () {
        $("#search-results ul li.search-result-active").removeClass("search-result-active");
        searchResultViewIsActive = true;
    }).on("mouseleave", "li", function () {        
        searchResultViewIsActive = false;
    });

    //search field focus/blur actions
    $("#searchfield").focus(function () {
        $(this).parent().addClass("searchbox-active");
    }).blur(function () {
        if (searchResultViewIsActive)
            return;
        $(this).parent().removeClass("searchbox-active");
        setTimeout(showOrHideSearchResultView(false), 2500);        
    })

    //Handel user interactions when deleting history row
    $("#search-history").on("click", "div", function() {

        var valueCol = $(this).closest("tr").find("td:first");
        //Get value for confirm dialog
        var value = "undefined";
        if (valueCol.length > 0)
            value = valueCol.html();

        var deleteHistoryRow = confirm("Do you want to delete the search value \"" + value + "\"?");
        if (deleteHistoryRow) {
            var parent = valueCol.parent();
            //If the row (parent to valuecol) has no siblings, hide the history element
            if (parent.prev().length == 0 && parent.next().length == 0)
                $("#search-history").hide();
            //Remove the row
            parent.remove();
        }
    })
    
    //Handle when user typing search values or pressing enter, up or down arrow
    $("#searchfield").keyup(function (e) {
        var searchValue = $(this).val();

        //Do nothing if value is empty
        if (searchValue.length == 0) {
            showOrHideSearchResultView(false);
            return;
        }

        showOrHideSearchResultView(true); //true = show
        
        //Do not perform search if search value is less than 3 charachters
        if (searchValue.length < 3) {
            $("#search-results ul").html("<li>Minimum length for search word is 3 characters</li>");
            return;
        }

        //Handele key press if enter, up or down arrow
        var proceedWithSearch = handleKeyPress(e);
        
        //Do not search if search value is the same as last or if user pressed enter, up or down arrow
        if (lastSearchValue == searchValue || !proceedWithSearch) {
            return;
        }

        lastSearchValue = searchValue;

        //Perform ajax request to LastFM api
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=5&artist=" + encodeURIComponent(searchValue) + "&api_key=3e3f1736b779e6d1a6af32f61cc59d43&format=json";
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (returnData) {
                //console.log(returnData.results.artistmatches.artist);
                //Clear last search results
                resetSearchResultView()

                var $ul = $("<ul/>");
                $.each(returnData.results.artistmatches.artist, function (k, v) {
                    var row = createListRow(v.name)
                    $ul.append(row);
                });

                $("#search-results").append($ul);
            }, //End success
            error: function (xhr, error, message) {
                //console.log(xhr);
                //console.log(error);
                //console.log(message);
                var row = createRow("Something went wrong while searching.")
                $ul.append(row);
            } //End error
        });    // End Ajax call
             
    });

    //Functions and helpers
    function handleKeyPress(e) {
        var code = e.keyCode || e.which;
        var activeCssClass = "search-result-active";
        var $selectedSearchResultItem = $("#search-results ul li." + activeCssClass);
        var hasSelectedResult = ($selectedSearchResultItem.length > 0);
        var searchValueOrSearchResult = hasSelectedResult ? $selectedSearchResultItem.html() : $("#searchfield").val();
                
        if (code == 13) { // enter
            saveSearch(searchValueOrSearchResult);
            return false;
        }
        else if (code == 40 || code == 38) {

            var moveSelectedUp = code == 38;
            
            if (!hasSelectedResult) // select first in resultlist
                $("#search-results ul li:first").addClass(activeCssClass);
            else {//move selection up or down
                var $itemToSelect;
                if (moveSelectedUp)
                    $itemToSelect = $selectedSearchResultItem.prev();
                else
                    $itemToSelect = $selectedSearchResultItem.next();

                if ($itemToSelect.length > 0) {
                    $selectedSearchResultItem.removeClass(activeCssClass);
                    $itemToSelect.addClass(activeCssClass);
                }
                else if ($itemToSelect.length == 0 && moveSelectedUp) {
                    $selectedSearchResultItem.removeClass(activeCssClass);
                }
            }
            return false;            
        }

        return true;
    }

    function resetSearchResultView() {
        $("#search-results").html("");
    }

    function showOrHideSearchResultView(show) {
        var cssClass = "hide";
        if (show)
            $("#search-results").removeClass(cssClass);
        else
            $("#search-results").addClass(cssClass);
        lastSearchValue = "";
    }

    function createListRow(searchResultValue) {
        return $("<li/>").html(searchResultValue);
    }

    function createTableRow(searchValue) {
        var row = $("<tr>");
        var valueCol = $("<td/>").html(searchValue);
        var timeStampCol = $("<td/>").append($("<small/>").html(getDateAndTime()));
        var deleteCol = $("<td/>").append($("<div/>"));
        row.append(valueCol);
        row.append(timeStampCol);
        row.append(deleteCol);
        return row;
    }

    function getDateAndTime() {
        var date = new Date();
        var dateString = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        dateString = dateString + "-" + formatAsTwoDigitNumber(month);
        dateString = dateString + "-" + formatAsTwoDigitNumber(day);
        dateString = dateString + " " + formatAsTwoDigitNumber(hours) + ":" + formatAsTwoDigitNumber(minutes);
        return dateString;
    }

    function formatAsTwoDigitNumber(number)
    {
        return number > 9 ? number : "0" + number
    }

    function saveSearch(searchValue) {
        $("#search-history").show();
        $("#searchfield").focus();
        $("#search-history table tbody").append(createTableRow(searchValue));
        showOrHideSearchResultView(false);
        resetSearchResultView();
        $("#searchfield").val("");
    }
});
