stocksList = ["AXP", "CMG", "MSI", "TGT"];

//-------creating validationList[] of stock symbols available-----//////
let validationList = [];
let validSymbol = '';
const queryURL2 = `https://api.iextrading.com/1.0/ref-data/symbols`; 

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
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=1`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response)
        const newStockDiv = $('<div>').addClass('card-body'); //create div to hold indivdual stock info
        
        const closeBtn = $('<button>').addClass('killDiv btn btn-outline-info').text("Close").css("float", "right");
        newStockDiv.append(closeBtn);

        const logoPic = response.logo.url;//retrieves logo url
        const logoHolder = $(`<img src="${logoPic}">`).addClass('logo').css('clear', 'both'); //logo img created
        const companyName = response.quote.companyName;  //retrieves and stores name from api
        const nameHolder = $('<h3 class="card-title">').text(`${companyName}   `);//formats stored name into html code
        nameHolder.prepend(logoHolder); //adds logo img to the end of the company name
        newStockDiv.append(nameHolder);  //appends above name into new stock div

        const moreBtn = $('<button>').addClass('btn btn-outline-info seeMore').text('See More').css("float", "right");
        newStockDiv.append(moreBtn);
        const lessBtn = $('<button>').addClass('btn btn-outline-info seeLess').text('See Less').css("float", "right").hide();
        newStockDiv.append(lessBtn);

        //repeating above 3 steps (minus logo img append) for stock symbol
        const stockSymbol = response.quote.symbol; //retrieves symbol from api
        const symbolHolder = $('<p class="card-text">').text(`Stock Symbol: ${stockSymbol}`);
        newStockDiv.append(symbolHolder);

        //repeating above steps for stock price
        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p class="card-text">').text(`Stock Price: ${stockPrice}`);
        newStockDiv.append(priceHolder);

        //creating "See More Info" button and function

        const previousClose = response.quote.previousClose;
        const change = response.quote.change;
        const changePercent = response.quote.changePercent;
        const week52High = response.quote.week52High;
        const week52Low = response.quote.week52Low;
        const ytdChange = response.quote.ytdChange;
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


        //repeating steps for news summary and link
        const companyNews = response.news[0].summary;
        const newsLink = response.news[0].url;
        const summaryHolder = $('<p class="card-text">').text(`News Headline: ${companyNews}`).css("clear", "both");
        const newsBtn = $(`   <a href=${newsLink}>`).text('See Article').attr('target', 'blank');
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
render();
}
else{
    alert(`${stockInput} is not a valid stock symbol`);
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
render();
