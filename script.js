//--------------Variables-------------------

var colNum = 0; //Represents the number of columns on the webpage 
var rowNum = 0; //Represents the number of rows on the webpage
var errorElement = null;


//------------------Executable Code-------------

document.getElementById('add-column-btn').addEventListener('click', addColumn);
document.getElementById('remove-column-btn').addEventListener('click', removeColumn);
document.getElementById('add-row-btn').addEventListener('click', addRow);
document.getElementById('remove-row-btn').addEventListener('click', removeRow);
document.getElementById('calculate-btn').addEventListener('click', calculateResult);

addRow();
addColumn();

//--------------------Support Methods-----------------

function addColumn()
{
    //Add a column-label element at the top of the page
    colNum++;
    var labelHTML = '<span class="criteria-span" id="criteria-span-' + colNum + '"><input type="text" class="criteria-label w3-theme-l2" placeholder="Criteria ' + colNum + '"></input><span class="criteria-subspan"><input class="weight-input w3-theme-l2" placeholder="Weight"></input><input class="out-of-input w3-theme-l2" placeholder="Out of"></input><span></span>';
    document.getElementById('criteria-list').insertAdjacentHTML('beforeend', labelHTML);
    
    //Add an extra score-box element to the end of every row
    var rows =  document.getElementById('option-list').childNodes;
    for (var i = 0; i < rows.length; i++)
    {
        addScoreBox(rows.item(i));
    }
}

function removeColumn()
{
    //If there are no columns to remove, return
    if (colNum === 0)
    {
        return;
    }
    
    //Delete the last column-label element
    var toRemove = document.getElementById('criteria-span-' + colNum);
    document.getElementById('criteria-list').removeChild(toRemove);
    colNum--;
    
    //Remove the last score-box element from every row
    var rows = document.getElementById('option-list').childNodes;
    for (var i = 0; i < rows.length; i++)
    {
        rows.item(i).removeChild(rows.item(i).lastChild);
    }
}

function addRow()
{
    //Add a new <div> element that represents a row of data
    rowNum++;
    var labelHTML = '<div class="row" id="option-' + rowNum + '"><input class="option-label w3-theme-l2" placeholder="Option ' + rowNum + '"></input></div>';
    document.getElementById('option-list').insertAdjacentHTML('beforeend', labelHTML);
    
    //Add as many score-boxes as there are columns on the page
    for (var i = 0; i < colNum; i++)
    {
        addScoreBox(document.getElementById('option-list').lastChild);
    }
}

function removeRow()
{
    //Remove the last row <div> element
    var toRemove = document.getElementById('option-' + rowNum);
    document.getElementById('option-list').removeChild(toRemove);
    rowNum--;
}

//Adds a score-box element to the specified row element
function addScoreBox(row)
{
    row.insertAdjacentHTML('beforeend', '<input class="score-box w3-theme-l3" placeholder="Score">');
}

//Caculates the final, best option
function calculateResult() 
{
    unmarkErrorElement();
    
    //Pull weight and out-of information from the top of the document.
    var cols = document.getElementById('criteria-list').childNodes;
    var colInfo = new Array(colNum);
    
    for (var i = 0; i < colNum; i++)
    {
        //[0] is weight, [1] is out of #
        colInfo[i] = new Array(2);
        
        //Check if the weight input has an error in it. If not, store info in arrary
        var weightElement = cols.item(i).childNodes.item(1).childNodes.item(0);
        if (!checkIfNumber(weightElement))
        {
            return;
        }
        colInfo[i][0] = parseFloat(weightElement.value);
        
        //Check if the outOfNumber input has an error in it. If not, store into array.
        var outOfNumberElement = cols.item(i).childNodes.item(1).childNodes.item(1);
        if (!checkIfNumber(outOfNumberElement))
        {
            return;
        }
        colInfo[i][1] = parseFloat(outOfNumberElement.value);
    }
    
    //Calculate the desirability score of each row
    var finalScoreArr = new Array(rowNum); //Contains the final score of each row
    var rows =  document.getElementById('option-list').childNodes; //NodeList of all option rows
    
    for (var i = 0; i < rowNum; i++)
    {
        var nextRow = rows.item(i);
        var nextScores = nextRow.childNodes;
        var rowScore = 0;
        for (var j = 0; j < colNum; j++)
        {
            var weight = colInfo[j][0];
            var outOfNumber = colInfo[j][1];
            
            //Check if score contains a parsable number. If yes, add the score to final row score
            var myScoreElement = nextScores.item(j+1);
            if (!checkIfNumber(myScoreElement))
            {
                return;
            }
            rowScore += (parseFloat(myScoreElement.value) / outOfNumber) * weight;
        }
        finalScoreArr[i] = rowScore;
    }
    
    var max = 0;
    var maxIndex = 0;
    for (var i = 0; i < finalScoreArr.length; i++)
    {
        if (finalScoreArr[i] > max)
        {
            max = finalScoreArr[i];
            maxIndex = i;
        }
    }
    
    /*
    var winnerName = rows.item(maxIndex).childNodes.item(0).value;
    document.getElementById('calculate-output').innerHTML = 'The winner is: ' + winnerName + '!';
    */
    
    var winnerRow = rows.item(maxIndex);
    winnerRow.style.border = "3px dashed lime";
}

//Returns true if the input to the element can be parsed into a float, false if it cannot.
function checkIfNumber(myElement)
{
    if (myElement.value === null)
    {
        markErrorElement(myElement);
        return false;
    }
    
    if (Number.isNaN(parseFloat(myElement.value)))
    {
        markErrorElement(myElement);
        return false;
    }
    
    return true;
}

function markErrorElement(myElement)
{
    myElement.setAttribute('style', 'border-style: solid; border-color: red;');
    errorElement = myElement;
}

function unmarkErrorElement()
{
    if (errorElement === null || errorElement === undefined)
    {
        return;
    }
    errorElement.setAttribute('style', 'border-style: hidden;');
}
