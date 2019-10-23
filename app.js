stocksList = ["AXP", "CMG", "MSI", "TGT", "T", "AMZN", "GOOG", "AAPL"];
token = "pk_110eba9da8c84c0e88d885292085ab63";

//-------creating validationList[] of stock symbols available-----//////
let validationList = [];
let validSymbol = '';
const queryURL2 = `https://api.iextrading.com/1.0/ref-data/symbols`; 

$(document).ready(function() {
    setTimeout(function(){
        $('#buttonMessage').fadeOut(5000);// or fade, css display however you'd like.
     });
});

$.ajax({
    url: queryURL2,
    method: 'Get'
}).then(function (resSymbol) {                                        
    for(i=0; i<resSymbol.length; i++){                                
        validSymbol = resSymbol[i].symbol;                            
        validationList.push(validSymbol);                             
    }                                                                 
    return validationList;

})                                                                    

//-----Displaying Stock Data after button is clicked-----//
const displayStockInfo = function(){
    const stock = $(this).attr('data-name');
    const stockQuery = `https://cloud.iexapis.com/stable/stock/${stock}/quote?token=${token}`;
    const newsQuery = `https://cloud.iexapis.com/stable/stock/${stock}/news?token=${token}`;
    const newStockDiv = $('<div>').addClass('card-body'); //create div to hold indivdual stock info

    $.ajax({
        url: stockQuery,
        method: 'GET'
    }).then(function(response) {
        console.log(response)
        
        const closeBtn = $('<button>').addClass('killDiv btn btn-outline-info').text("Close").css("float", "right");
        newStockDiv.append(closeBtn);

        let logoPic = `https://storage.googleapis.com/iex/api/logos/${stock}.png`;
        if(width(logoPic) != 0) {
            console.log("Logo width is " + logoPic.width());
        } else {
            console.log("There is now width");
        }

        const logoHolder = $(`<img src=${logoPic} alt=''>`).addClass('logo').css('clear', 'both'); //logo img created
        const companyName = response.companyName;  //retrieves and stores name from api
        const nameHolder = $('<h3 class="card-title">').text(`${companyName}   `);//formats stored name into html code
        nameHolder.prepend(logoHolder); //adds logo img to the front of the company name
        newStockDiv.append(nameHolder);  //appends above name into new stock div

        const moreBtn = $('<button>').addClass('btn btn-outline-info seeMore').text('See More').css("float", "right");
        newStockDiv.append(moreBtn);
        const lessBtn = $('<button>').addClass('btn btn-outline-info seeLess').text('See Less').css("float", "right").hide();
        newStockDiv.append(lessBtn);

        //repeating above 3 steps (minus logo img append) for stock symbol
        const stockSymbol = response.symbol; //retrieves symbol from api
        const symbolHolder = $('<p classı"card-text">').text(`Stock Symbol: ${stockSymbol}`);
        newStockDiv.append(symbolHolder);

        //repeating above steps for stock price
        const stockPrice = response.latestPrice;
        const priceHolder = $('<p class="card-text">').text(`Stock Price: ${stockPrice}`);
        newStockDiv.append(priceHolder);

        //creating "See More Info" button and function
        const previousClose = response.previousClose;
        const change = response.change;
        const changePercent = response.changePercent;
        const week52High = response.week52High;
        const week52Low = response.week52Low;
        const ytdChange = response.ytdChange;
        const prevHolder = $('<p class="card-text more">').text(`Previous Close: ${previousClose}`).hide();
        const changeHolder = $('<p class="card-text more">').text(`Change: ${change}`).hide();
        const percentHolder = $('<p class="card-text more">').text(`Change Percent: ${changePercent}`).hide();
        const highHolder = $('<p class="card-text more">').text(`52-week High: ${week52High}`).hide();
        const lowHolder = $('<p class="card-text more">').text(`52-week Low: ${week52Low}`).hide();
        const ytdHolder = $('<p class="card-text more">').text(`Year-to-date Change: ${ytdChange}`).hide();
        newStockDiv.append(prevHolder);
        newStockDiv.append(changeHolder);
        newStockDiv.append(percentHolder);
        newStockDiv.append(highHolder);
        newStockDiv.append(lowHolder);
        newStockDiv.append(ytdHolder);

        $.ajax({
            url: newsQuery,
            method: 'GET'
        }).then(function(nResponse) {
    
        const companyNews = nResponse[0].headline;
        const newsLink = nResponse[0].url;
        const picURL = nResponse[0].image;
        const summaryHolder = $(`<p class="card-text"> >`).text(`News Headline: ${companyNews}`).css("clear", "both");
        const newsBtn = $(`<a href=${newsLink}>`).text('  See Article  ').attr('target', '_blank');
        // const newsPic = $(`<img src=${picURL} class="newsPic" alt=''>`) //.hide();
        summaryHolder.append(newsBtn);
        // summaryHolder.append(newsPic);        
        newStockDiv.append(summaryHolder);
    
        });

        $('#stockForm').after(newStockDiv);
    })

}


//------------Rendering Button Group to Page------//
const renderButtons = function(){
    //reset button list
    $(".buttonRow").empty();
    for(i=0; i<stocksList.length; i++){
        const newButton = $('<button>').addClass("btn btn-info"); 
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
renderButtons();
}
else{
    $('#notSymbol').show();
    setTimeout(function(){
        $('#notSymbol').fadeOut(2000);// or fade, css display however you'd like.
     });
    // alert(`${stockInput} is not a valid stock symbol`);
}
$('#stockInput').val('');
}





//--------------Function Calling --------------//
$(document).on('click', '.seeMore', function(){
    $(this).parent().children('.seeMore').hide();
    $(this).parent().children('.more').toggle('display');
    $(this).parent().children('.seeLess').show();
});
$(document).on('click', '.seeLess', function(){
    $(this).parent().children('.seeLess').hide();
    $(this).parent().children('.more').toggle('display');
    $(this).parent().children('.seeMore').show();
});
$(document).on('click', '.killDiv', function(){
    $(this).parent().hide();
});
$('#addStock').on('click', addButton);
$('.buttonRow').on('click','.stock-btn', displayStockInfo);
renderButtons();
