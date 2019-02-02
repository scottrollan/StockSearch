stocksList = ["AXP", "CMG", "MSI", "TGT"];

//-------creating validationList[] of stock symbols available-----//////
let validationList = [];                                              //
let validSymbol = '';                                                 //
const queryURL2 = `https://api.iextrading.com/1.0/ref-data/symbols`;  //

$.ajax({                                                              //
    url: queryURL2,                                                   //
    method: 'Get'                                                     //working on
}).then(function (resSymbol) {                                        //
    for(i=0; i<resSymbol.length; i++){                                //
        validSymbol = resSymbol[i].symbol;                            //
        validationList.push(validSymbol);                             //
    }                                                                 //
    return validationList;

})                                                                    //


//-----Displaying Stock Data after button is clicked-----//
const displayStockInfo = function(){
    const stock = $(this).attr('data-name');
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=1`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {

        const newStockDiv = $('<div>').addClass('card-body'); //create div to hold indivdual stock info


        const logoPic = response.logo.url;//retrieves logo url
        const logoHolder = `<img src="${logoPic}">    `; //logo img created
        const companyName = response.quote.companyName;  //retrieves and stores name from api
        const nameHolder = $('<h3 class="card-title">').text(`${companyName}   `);//formats stored name into html code
        nameHolder.prepend(logoHolder); //adds logo img to the end of the company name
        newStockDiv.append(nameHolder);  //appends above name into new stock div

        //repeating above 3 steps (minus logo img append) for stock symbol
        const stockSymbol = response.quote.symbol; //retrieves symbol from api
        const symbolHolder = $('<p class="card-text">').text(`Stock Symbol: ${stockSymbol}`);
        newStockDiv.append(symbolHolder);
        
        //repeating above steps for stock price
        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p class="card-text">').text(`Stock Price: ${stockPrice}`);
        newStockDiv.append(priceHolder);

        //repeating steps for news summary and link
        const companyNews = response.news[0].summary;
        const newsLink = response.news[0].url;
        const summaryHolder = $('<p class="card-text">').text(`News Headline: ${companyNews}   `);
        const newsBtn = $(`   <a href=${newsLink}>`).text('See Article');
        summaryHolder.append(newsBtn);
        newStockDiv.append(summaryHolder);

        $('#stockForm').after(newStockDiv);
    })
}



//------------Rendering Button Group to Page------//
const render = function(){
    //reset button list
    $(".buttonRow").empty();
    for(i=0; i<stocksList.length; i++){
        const newButton = $('<button>'); 
        newButton.addClass('stock-btn');
        newButton.attr('data-name', stocksList[i]);
        newButton.text(stocksList[i].toUpperCase());
        $('.buttonRow').append(newButton);
    }
}



//-------Receiving Input to make New Buttons----------------//
const addButton = function(event){
event.preventDefault();
const stockInput = $('#stockInput').val().trim();
const upperCaseStock = stockInput.toUpperCase();
if(validationList.includes(upperCaseStock)){
stocksList.push(upperCaseStock);
render();
}
else{
    alert(`${stockInput} is not a valid stock symbol`);
}
$('#stockInput').val('');

}





//--------------Function Calling --------------//

$('#addStock').on('click', addButton);
$('.buttonRow').on('click','.stock-btn', displayStockInfo);
render();
