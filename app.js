stocksList = ["GOOG", "AMZN", "MSI", "TGT"];


//-----Displaying Stock Data after button is clicked-----//
const displayStockInfo = function(){
    const stock = $(this).attr('data-name');
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=1`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        const stockDiv = $('<div>').addClass('stock'); //ceate div to hold ALL stock info
        //LOGO BEGIN
        const logoPic = response.logo.url;
        const logoHolder = $(`<img="${logoPic}" alt="logo`)
        stockDiv.append(logoHolder);
        //LOGO END
        const companyName = response.quote.companyName;  //retrieves and stores name from api
        const nameHolder = $('<h3>').text(`Company Name: ${companyName}`);//formats stored name into html code
        stockDiv.append(nameHolder);  //appends above name into new stock div
        //repeating above 3 steps for stock symbol
        const stockSymbol = response.quote.symbol; //retrieves symbol from api
        const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
        stockDiv.append(symbolHolder);
        //repeatin above steps for stock price
        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p>').text(`Stock Price: ${stockPrice}`);
        stockDiv.append(priceHolder);
        //repeating steps for news summary
        const companyNews = response.news[0].summary;
        const summaryHolder = $('<p>').text(`News Headline: ${companyNews}`);
        stockDiv.append(summaryHolder);
        $('#stocksView').prepend(stockDiv);

    })
}



//------------Rendering Button Group to Page------//
const render = function(){
    //reset button list
    $(".btn-group").empty();
    for(i=0; i<stocksList.length; i++){
        const newButton = $('<button>'); 
        newButton.addClass('stock-btn');
        newButton.attr('data-name', stocksList[i]);
        newButton.text(stocksList[i]);
        $('.btn-group').append(newButton);
    }
}



//-------Receiving Input for New Buttons----------------//
const addButton = function(event){
event.preventDefault();
const stockInput = $('#stockInput').val().trim();
stocksList.push(stockInput);
$('stockInput').val('');
render();
}





//--------------Function Calling --------------//

$('#addStock').on('click', addButton);
$('.btn-group').on('click','.stock-btn', displayStockInfo);
render();
